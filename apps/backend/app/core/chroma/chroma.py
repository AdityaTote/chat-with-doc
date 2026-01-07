import chromadb

from app.config import Config
from app.core.utils.rag import HuggingFaceAdapter


class ChromaClient:
    def __init__(self, host: str, port: int, ssl: bool) -> None:
        self._host = host
        self._port = port
        self._ssl = ssl
        self._client = None
        self._connect()

    def _connect(self):
        if not self._client:
            self._client = chromadb.HttpClient(
                host=self._host, port=self._port, ssl=self._ssl
            )
        return self._client

    def _create_collection(self, name: str = "docs"):
        if self._client:
            return self._client.create_collection(
                name=name,
                embedding_function=HuggingFaceAdapter,
                metadata={
                    "description": "Document collection for RAG-based chat system",
                    "project": "rag-docs",
                    "type": "chat-with-documents",
                    "purpose": "Store and retrieve document embeddings for conversational AI",
                },
            )
        raise ConnectionError("Client not connected")

    def get_docs(self):
        if self._client:
            try:
                collection = self._client.get_collection(
                    name="docs",
                    embedding_function=HuggingFaceAdapter,
                )
                return collection
            except Exception:
                # Collection doesn't exist, create it
                collection = self._create_collection(name="docs")
                return collection
        raise ConnectionError("Client not connected")


docs = ChromaClient(
    host=Config["Env"].chromadb_host,
    port=Config["Env"].chromadb_port,
    ssl=Config["Env"].chromadb_ssl,
).get_docs()
