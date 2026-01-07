import os
from dotenv import load_dotenv

from app.schemas.env import EnvSchema

load_dotenv()

env = EnvSchema(
    access_token_secret=os.getenv("ACCESS_TOKEN_SECRET", ""),
    aws_access_key=os.getenv("AWS_ACCESS_KEY", ""),
    aws_secret_key=os.getenv("AWS_SECRET_KEY", ""),
    aws_region=os.getenv("AWS_REGION", ""),
    aws_cloudfront_url=os.getenv("AWS_CLOUDFRONT_URL", ""),
    database_uri=os.getenv("DATABASE_URI", ""),
    aws_bucket=os.getenv("AWS_BUCKET", ""),
    port=int(os.getenv("PORT", "8080")),
    chromadb_host=os.getenv("CHROMADB_HOST", "localhost"),
    chromadb_port=int(os.getenv("CHROMADB_PORT", "8000")),
    chromadb_ssl=os.getenv("CHROMADB_SSL", "False").lower() == "true",
)

Config = {"Env": env}
