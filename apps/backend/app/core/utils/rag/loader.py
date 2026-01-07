from langchain_community.document_loaders import S3FileLoader
from langchain_core.documents import Document

from app.config import Config


def load_document(key: str) -> list[Document]:
    loader = S3FileLoader(
        bucket=Config["Env"].aws_bucket,
        key=key,
        aws_access_key_id=Config["Env"].aws_access_key,
        aws_secret_access_key=Config["Env"].aws_secret_key,
        region_name=Config["Env"].aws_region,
    )
    return loader.load()
