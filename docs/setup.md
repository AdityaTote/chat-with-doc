# Setup Guide

## Prerequisites

| Tool | Version |
|---|---|
| [Bun](https://bun.sh) | ≥ 1.2 |
| [Python](https://python.org) | 3.10 – 3.12 |
| [uv](https://docs.astral.sh/uv/) | latest |
| [Docker](https://docs.docker.com/get-docker/) + Compose | latest |
| AWS account | S3 bucket + CloudFront distribution |
| Google AI Studio | Gemini API key (`GOOGLE_API_KEY`) |

## Local Development

### 1. Clone

```bash
git clone https://github.com/<your-org>/chatwithdocs.git
cd chatwithdocs
```

### 2. Install JS dependencies

```bash
bun install
```

### 3. Install backend Python dependencies

```bash
cd apps/backend
uv sync
cd ../..
```

### 4. Configure environment

```bash
cp apps/backend/.env.example apps/backend/.env
# Fill in all values — see docs/configuration.md
```

Frontend:
```bash
# apps/web/.env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 5. Start infrastructure

```bash
docker compose up -d db chroma
```

### 6. Run database migrations

```bash
cd apps/backend
uv run alembic upgrade head
cd ../..
```

### 7. Start dev servers

```bash
# Starts backend (8080) + frontend (3000) in parallel via Turborepo
bun dev
```

Or backend only:
```bash
cd apps/backend
just dev    # uvicorn app.main:app --reload
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/docs |
| ChromaDB | http://localhost:8000 |
| Prometheus metrics | http://localhost:8080/metrics |

## Docker (Full Stack)

```bash
# Requires apps/backend/.env to exist
docker compose up --build
```

The `migrator` service runs `alembic upgrade head` before `rag_backend` starts (`depends_on: condition: service_completed_successfully`).

> The web container is defined but commented out in `docker-compose.yml`. Run the frontend locally or uncomment and build separately.
