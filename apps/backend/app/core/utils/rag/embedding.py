from typing import List
from chromadb.api.types import EmbeddingFunction, Documents, Embeddings
from fastembed import TextEmbedding

MODEL_NAME = "BAAI/bge-small-en-v1.5"


class FastEmbedFunction(EmbeddingFunction):
    def __init__(self, model_name: str = MODEL_NAME):
        self._model = TextEmbedding(model_name=model_name)

    def __call__(self, input: Documents) -> Embeddings:
        embeddings = list(self._model.embed(input))
        return [e.tolist() for e in embeddings]

    def embed_documents(self, texts: List[str]) -> Embeddings:
        embeddings = list(self._model.embed(texts))
        return [e.tolist() for e in embeddings]


fast_embed = FastEmbedFunction()


def generate_embeddings(chunk_data: List[str]) -> Embeddings:
    return fast_embed.embed_documents(chunk_data)
