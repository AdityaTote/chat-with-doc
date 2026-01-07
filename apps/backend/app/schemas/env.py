from pydantic import BaseModel, Field


class EnvSchema(BaseModel):
    port: int = Field(default=8080)
    database_uri: str
    access_token_secret: str
    aws_bucket: str
    aws_region: str
    aws_access_key: str
    aws_secret_key: str
    aws_cloudfront_url: str
    chromadb_host: str
    chromadb_port: int
    chromadb_ssl: bool
