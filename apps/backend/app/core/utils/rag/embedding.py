from typing import List
from chromadb.api.types import EmbeddingFunction, Documents
from langchain_huggingface import HuggingFaceEmbeddings


def embedding_function():
    return HuggingFaceEmbeddings(
        model_name="BAAI/bge-small-en",
        model_kwargs={"device": "cpu"},
        encode_kwargs={"normalize_embeddings": True},
    )


def generate_embeddings(chunk_data: List[str]) -> list[list[float]]:
    hf = embedding_function()
    vec = hf.embed_documents(chunk_data)
    return vec


class HuggingFaceEmbeddingAdapter(EmbeddingFunction):
    def __init__(self, hf_embeddings):
        self.hf_embeddings = hf_embeddings

    def __call__(self, input: Documents) -> list[list[float]]:
        return self.hf_embeddings.embed_documents(input)


HuggingFaceAdapter = HuggingFaceEmbeddingAdapter(embedding_function())
