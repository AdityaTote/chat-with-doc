import uuid
import boto3
import httpx

from app.config import Config
from app.schemas.s3 import GeneratePresignedURLResponseSchema

ALLOWED_CONTENT_TYPES = {
    "application/pdf": ".pdf",
    "text/markdown": ".md",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
    "text/plain": ".txt",
}


class S3Client:
    def __init__(self, bucket_name: str):
        self._bucket = bucket_name
        self._client = boto3.client(
            "s3",
            aws_access_key_id=Config["Env"].aws_access_key,
            aws_secret_access_key=Config["Env"].aws_secret_key,
            region_name=Config["Env"].aws_region,
        )

    def generate_put_presigned_url(self, content_type: str, expires_in: int = 300):
        self._validate_upload(content_type)
        object_key = self._generate_object_key(content_type)
        print("object_key", object_key)

        url = self._client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": self._bucket,
                "Key": object_key,
                "ContentType": content_type,
            },
            ExpiresIn=expires_in,
            HttpMethod="PUT",
        )

        print("presigned url", url)

        return GeneratePresignedURLResponseSchema(
            object_key=object_key,
            upload_url=url,
        )

    def upload_file_to_presigned_url(
        self, url: str, object_key: str, file: bytes, content_type: str
    ):
        print("uploading to s3...", url, "object_key", object_key)
        response = httpx.put(
            url,
            headers={
                "Content-Type": content_type,
            },
            content=file,
            timeout=60,
        )

        response.raise_for_status()
        print("s3 upload response", response.status_code)

        return f"{Config["Env"].aws_cloudfront_url}/{object_key}"

    def _generate_object_key(self, content_type: str):
        ext = ALLOWED_CONTENT_TYPES[content_type]
        return f"uploads/{uuid.uuid4()}{ext}"

    def _validate_upload(self, content_type: str):
        if content_type not in ALLOWED_CONTENT_TYPES:
            raise ValueError("Unsupported file type")


s3 = S3Client(bucket_name=Config["Env"].aws_bucket)
