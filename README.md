# chatwithdocs

A full-stack Retrieval-Augmented Generation (RAG) application. Upload a document and have a multi-turn, context-aware conversation with it — powered by Google Gemini 2.5 Flash and local vector embeddings over ChromaDB.

---

## Features

- Upload PDF, DOCX, PPTX, XLSX, TXT, or Markdown files
- Local embeddings via `fastembed` — no external embedding API
- Semantic vector search over ChromaDB, scoped per document
- Multi-turn chat with conversation history injection
- `highlight_text` — nearest source chunks returned alongside every answer
- Auto-generated session titles from document context
- JWT auth with bcrypt password hashing
- Paginated session list and chat history
- Prometheus metrics endpoint
- Next.js 16 frontend with drag-and-drop upload and Markdown-rendered responses

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| **State / Fetching** | Zustand, TanStack React Query v5, Axios |
| **Backend** | FastAPI, Python 3.10–3.12, Uvicorn |
| **LLM** | Google Gemini 2.5 Flash (`langchain-google-genai`) |
| **Embeddings** | `fastembed` (local, in-process) |
| **Vector DB** | ChromaDB (self-hosted) |
| **Relational DB** | PostgreSQL + SQLAlchemy 2.0 + Alembic |
| **File Storage** | AWS S3 + CloudFront CDN |
| **Monorepo** | Turborepo + Bun workspaces |
| **Observability** | `prometheus_client` + custom Starlette middleware |
| **Containerisation** | Docker Compose |

---

## Project Structure

```
rag-docs/
├── apps/
│   ├── backend/               # FastAPI application
│   │   ├── app/
│   │   │   ├── api/           # Route handlers (auth, session)
│   │   │   ├── core/          # RAG pipeline, S3, ChromaDB, embeddings, LLM
│   │   │   ├── database/      # SQLAlchemy models + session factory
│   │   │   ├── middlewares/   # JWT auth, Prometheus
│   │   │   ├── schemas/       # Pydantic schemas
│   │   │   └── services/      # AuthService, SessionService
│   │   ├── migrations/        # Alembic revisions
│   │   └── justfile
│   └── web/                   # Next.js frontend
│       └── src/
│           ├── app/           # App Router pages (auth, dashboard, chat)
│           ├── components/    # chat-interface, file-upload, sidebar
│           ├── hooks/         # useAuth, useSession
│           └── store/         # Zustand auth store
├── packages/                  # Shared ui, eslint-config, typescript-config
├── docs/                      # Extended documentation (see below)
├── docker/
├── docker-compose.yml
└── turbo.json
```

---

## Quick Start

```bash
git clone https://github.com/<your-org>/chatwithdocs.git
cd chatwithdocs
bun install
cp apps/backend/.env.example apps/backend/.env   # fill in values
docker compose up -d db chroma
cd apps/backend && uv sync && uv run alembic upgrade head && cd ../..
bun dev
```

Full step-by-step instructions → [docs/setup.md](./docs/setup.md)

---

## Documentation

| Doc | Description |
|---|---|
| [docs/setup.md](./docs/setup.md) | Prerequisites, local dev, Docker setup |
| [docs/configuration.md](./docs/configuration.md) | All environment variables |
| [docs/api.md](./docs/api.md) | API endpoints, request/response shapes, examples |
| [docs/architecture.md](./docs/architecture.md) | Ingestion & query pipelines, DB schema, file type support |
| [docs/contributing.md](./docs/contributing.md) | Branching, formatting, migration requirements |

---

## License

[MIT](./LICENSE)
