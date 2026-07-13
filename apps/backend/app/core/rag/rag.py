from datetime import datetime, timezone
import logging

from sqlalchemy.orm import Session

from app.database.models.sessions import Session as SessionModel
from app.core.utils.rag import loader, chunk_doc, generate_embeddings
from app.core.chroma import docs
from app.schemas.rag import RagStore, RagQuery, LlmQuery
from app.core.utils.rag.llm import generate_session_name, llm_response
from app.database.models.documents import Document
from app.core.utils.exceptions.rag import (
    DocumentLoadError,
    DocumentChunkingError,
    EmbeddingGenerationError,
    VectorStoreError,
)
from chromadb.api.types import Metadata

# TODO: Add Hybrid search:
#       - implement BM25 search for text-based retrieval
#       - store the chunks to a relational database for text-based retrieval
class Rag:

    @staticmethod
    def store(input_data: RagStore) -> bool:
        try:
            # load document from s3 with object key
            doc = loader.load(input_data.doc_key)
            if not doc:
                raise DocumentLoadError(input_data.doc_key)

            # split the document into small chunks
            chunk_data = chunk_doc(doc)
            if not chunk_data:
                raise DocumentChunkingError(input_data.doc_key)

            # convert chunks to embedding vectors
            vec = generate_embeddings(chunk_data=chunk_data)
            if not vec:
                raise EmbeddingGenerationError("No embeddings generated")

            chunk_ids = [
                f"{input_data.doc_id}_chunk_{i}" for i in range(len(chunk_data))
            ]
            metadatas: list[Metadata] = [
                {
                    "doc_id": str(input_data.doc_id),
                    "chunk_index": i,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "doc_type": input_data.doc_type,
                    } 
                for i in range(len(chunk_data))
            ]

            # store the vector embedding in vector db
            docs.add(
                ids=chunk_ids, embeddings=vec, documents=chunk_data, metadatas=metadatas
            )

            logging.info(
                f"Successfully stored document: {input_data.doc_key} with {len(chunk_data)} chunks"
            )
            return True

        except (
            DocumentLoadError,
            DocumentChunkingError,
            EmbeddingGenerationError,
            VectorStoreError,
        ) as e:
            logging.error(f"error: {e.message}")
            raise
        except Exception as e:
            logging.error(
                f"Unexpected error storing document {input_data.doc_key}: {str(e)}",
                exc_info=True,
            )
            raise VectorStoreError(str(e))

    @staticmethod
    def query(input_data: RagQuery):
        try:
            # validate input
            if not input_data.query or not input_data.query.strip():
                raise ValueError("Query cannot be empty")

            logging.info(f"Processing query for document: {input_data.doc_id}")

            # convert query to vector embeddings
            try:
                vec = generate_embeddings([input_data.query])
                if not vec:
                    raise EmbeddingGenerationError(
                        "Failed to generate query embeddings"
                    )
            except Exception as e:
                logging.error(
                    f"Error generating embeddings for query: {str(e)}",
                    exc_info=True,
                )
                raise EmbeddingGenerationError(f"Query embedding failed: {str(e)}")

            # query vector db with the vector embed query
            try:
                result = docs.query(
                    query_embeddings=vec,
                    n_results=5,
                    where={"doc_id": str(input_data.doc_id)},
                )
                if not result:
                    raise VectorStoreError("No results returned from vector database")

                documents = result.get("documents") or []
                flattened_docs = (
                    [str(doc) for sublist in documents for doc in sublist]
                    if documents
                    else []
                )

                

                if not flattened_docs:
                    logging.warning(
                        f"No documents found for query on doc_id: {input_data.doc_id}"
                    )
                else:
                    logging.info(
                        f"Retrieved {len(flattened_docs)} document chunks for query"
                    )
            except VectorStoreError:
                raise
            except Exception as e:
                logging.error(
                    f"Error querying vector database: {str(e)}",
                    exc_info=True,
                )
                raise VectorStoreError(f"Vector database query failed: {str(e)}")

            # prepare llm query input
            try:
                llm_query = LlmQuery(
                    query=input_data.query,
                    doc_data=flattened_docs,
                    context=input_data.context if input_data.context else None,
                    history=input_data.history if input_data.history else None,
                )

                # get llm response
                response = llm_response(input_data=llm_query)

                if not response:
                    raise ValueError("LLM returned empty response")

                logging.info(
                    f"Successfully generated response for query on doc_id: {input_data.doc_id}"
                )
                return response

            except Exception as e:
                logging.error(
                    f"Error generating LLM response: {str(e)}",
                    exc_info=True,
                )
                raise VectorStoreError(f"LLM response generation failed: {str(e)}")

        except (EmbeddingGenerationError, VectorStoreError, ValueError) as e:
            logging.error(f"Query error: {str(e)}")
            raise
        except Exception as e:
            logging.error(
                f"Unexpected error processing query for doc_id {input_data.doc_id}: {str(e)}",
                exc_info=True,
            )
            raise VectorStoreError(f"Unexpected query error: {str(e)}")
    
    @staticmethod
    def extract_text_from_doc(ans: str, doc_id: str):
        try:
            logging.info(f"Extracting text from document: {doc_id}")

            # generate embeddings from answer
            try:
                ans_embed = generate_embeddings(chunk_data=[ans])
                if not ans_embed:
                    raise EmbeddingGenerationError(
                        "Failed to generate embeddings from answer"
                    )
            except Exception as e:
                logging.error(
                    f"Error generating embeddings for answer: {str(e)}",
                    exc_info=True,
                )
                raise EmbeddingGenerationError(f"Answer embedding failed: {str(e)}")

            # query vector database
            try:
                result = docs.query(
                    query_embeddings=ans_embed,
                    n_results=2,
                    where={"doc_id": doc_id}
                )
                if not result:
                    raise VectorStoreError("No results returned from vector database")

                documents = result.get("documents") or []
                flattened_docs = (
                    [str(doc) for sublist in documents for doc in sublist]
                    if documents
                    else []
                )

                if not flattened_docs:
                    logging.warning(
                        f"No documents found for extraction on doc_id: {doc_id}"
                    )
                else:
                    logging.info(
                        f"Retrieved {len(flattened_docs)} document chunks for extraction"
                    )

                return flattened_docs

            except VectorStoreError:
                raise
            except Exception as e:
                logging.error(
                    f"Error querying vector database: {str(e)}",
                    exc_info=True,
                )
                raise VectorStoreError(f"Vector database query failed: {str(e)}")

        except (EmbeddingGenerationError, VectorStoreError, ValueError) as e:
            logging.error(f"Extract text error: {str(e)}")
            raise
        except Exception as e:
            logging.error(
                f"Unexpected error extracting text for doc_id {doc_id}: {str(e)}",
                exc_info=True,
            )
            raise VectorStoreError(f"Unexpected extraction error: {str(e)}")

    @staticmethod
    def generate_session_name(session_token: str, db: Session) -> str:

        doc = (
            db.query(Document)
            .join(SessionModel)
            .filter(SessionModel.session_token == session_token)
            .first()
        )
        if not doc:
            raise ValueError(f"No document found for session token: {session_token}")
        result = docs.get(where={"doc_id": str(doc.id)}, limit=2)
        documents = result.get("documents") or []
        context = " ".join(documents) if documents else ""
        title = generate_session_name(context=context)
        session = (
            db.query(SessionModel)
            .filter(SessionModel.session_token == session_token)
            .first()
        )
        if session:
            session.title = title
            db.commit()
            db.refresh(session)
            return title
        else:
            raise ValueError(f"No session found for token: {session_token}")
