# Configuration

## Backend — `apps/backend/.env`

Copy from `.env.example`:

```bash
cp apps/backend/.env.example apps/backend/.env
```

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Uvicorn listen port |
| `DATABASE_URI` | Yes | PostgreSQL DSN |
| `ACCESS_TOKEN_SECRET` | Yes | JWT signing secret (min. 32 chars) |
| `GOOGLE_API_KEY` | Yes | Google Gemini API key |
| `AWS_ACCESS_KEY` | Yes | IAM access key ID |
| `AWS_SECRET_KEY` | Yes | IAM secret access key |
| `AWS_REGION` | Yes | S3 bucket region |
| `AWS_BUCKET` | Yes | S3 bucket name |
| `AWS_CLOUDFRONT_URL` | Yes | CloudFront base URL (no trailing slash) |
| `CHROMADB_HOST` | Yes | ChromaDB hostname |
| `CHROMADB_PORT` | Yes | ChromaDB HTTP port |
| `CHROMADB_SSL` | No | Enable TLS for ChromaDB |

## Frontend — `apps/web/.env`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `http://localhost:8080` |
