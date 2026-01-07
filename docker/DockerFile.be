# syntax=docker/dockerfile:1
FROM python:3.13-slim

# Install system dependencies required for sentence-transformers and PDF processing
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

WORKDIR /app

COPY ./apps/backend/pyproject.toml ./
COPY ./apps/backend/uv.lock ./

RUN uv venv .venv && uv sync --frozen

COPY ./apps/backend/app ./app
COPY ./apps/backend/migrations ./migrations
COPY ./apps/backend/alembic.ini ./

ENV PATH="/app/.venv/bin:$PATH"

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]