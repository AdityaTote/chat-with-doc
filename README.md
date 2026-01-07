# RAG Docs

A Retrieval-Augmented Generation (RAG) application built with a modern tech stack, featuring a Next.js frontend and a FastAPI backend.


## 🧠 RAG Architecture & Pipeline

The application implements a robust Retrieval-Augmented Generation (RAG) pipeline to provide accurate, context-aware answers from your documents.

### 1. Ingestion Pipeline (`apps/backend/app/core/rag/rag.py`)
When a document is uploaded:
1.  **Loading**: Documents are fetched from S3 using `S3FileLoader`.
2.  **Chunking**: Text is split into manageable chunks (1000 characters) using `RecursiveCharacterTextSplitter` to ensure optimal context window usage.
3.  **Embedding**: Each chunk is converted into a vector embedding using the **BAAI/bge-small-en** model via `HuggingFaceEmbeddings`. This model is optimized for retrieval tasks.
4.  **Storage**: Vectors and metadata are stored in **ChromaDB**, a high-performance open-source vector database.

### 2. Retrieval & Generation (`apps/backend/app/core/utils/rag/llm.py`)
When a user asks a question:
1.  **Query Embedding**: The user's question is converted into a vector using the same embedding model.
2.  **Semantic Search**: `ChromaDB` performs a similarity search to find the most relevant document chunks.
3.  **Context Assembly**: Retrieved chunks are combined with the conversation history (to support follow-up questions).
4.  **LLM Generation**: The assembled context and user query are sent to **Google Gemini 2.5 Flash** (`gemini-2.5-flash`).
5.  **Response**: The LLM generates a concise, accurate answer based *only* on the provided context, citing sources where possible.

### Key Components
-   **LLM**: Google Gemini 2.5 Flash (via `langchain-google-genai`)
-   **Embeddings**: BAAI/bge-small-en (via `langchain-huggingface`)
-   **Vector Store**: ChromaDB
-   **Orchestration**: LangChain

## 🛠️ Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (`npm install -g bun`)
- [Python](https://www.python.org/) (v3.13+)
- [Docker](https://www.docker.com/) & Docker Compose
- [uv](https://github.com/astral-sh/uv) (Recommended for Python dependency management)

## 🚀 Tech Stack

### Frontend (`apps/web`)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend (`apps/backend`)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: Python 3.13+
- **AI/ML**: 
  - [LangChain](https://www.langchain.com/)
  - [HuggingFace](https://huggingface.co/)
  - [Sentence Transformers](https://www.sbert.net/)
  - [Google GenAI](https://ai.google.dev/)
- **Database**: 
  - [PostgreSQL](https://www.postgresql.org/) (Application Data)
  - [ChromaDB](https://www.trychroma.com/) (Vector Database)
- **Migrations**: [Alembic](https://alembic.sqlalchemy.org/)
- **Package Manager**: [uv](https://github.com/astral-sh/uv)

### Infrastructure & Tools
- **Monorepo**: [Turborepo](https://turbo.build/)
- **Runtime**: [Bun](https://bun.sh/) (Frontend), Python (Backend)
- **Containerization**: Docker & Docker Compose

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd rag-docs
   ```

2. **Install Frontend Dependencies**:
   ```bash
   bun install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd apps/backend
   uv sync
   ```

## ⚙️ Configuration

### Backend
1. Navigate to `apps/backend`.
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your API keys (Google GenAI, etc.) and database credentials.

### Frontend
1. Navigate to `apps/web`.
2. Create a `.env` file (if not present) and configure necessary environment variables (e.g., API base URL).

## 🏃‍♂️ Running the Application

### Option 1: Hybrid (Recommended for Dev)
Run the infrastructure (DBs) in Docker, and the apps locally for hot-reloading.

1. **Start Databases (Postgres & Chroma)**:
   ```bash
   docker-compose up -d db chroma
   ```

2. **Start Backend**:
   ```bash
   cd apps/backend
   # Apply migrations
   alembic upgrade head
   # Start server
   uvicorn app.main:app --reload --port 8080
   # OR if using just
   just dev
   ```

3. **Start Frontend**:
   From the root directory:
   ```bash
   bun dev
   # OR
   turbo run dev
   ```
   The web app will be available at `http://localhost:3000`.

### Option 2: Full Docker
Run the entire backend stack in Docker.

1. **Start Backend & DBs**:
   ```bash
   docker-compose up -d --build
   ```
   This starts Postgres, Chroma, and the FastAPI backend (on port 8080).

2. **Start Frontend**:
   ```bash
   bun dev
   ```

## 📂 Project Structure

```
rag-docs/
├── apps/
│   ├── web/          # Next.js Frontend Application
│   └── backend/      # FastAPI Backend Application
├── packages/         # Shared packages (if any)
├── docker/           # Docker configurations
├── docker-compose.yml
├── turbo.json        # Turborepo configuration
└── package.json
```

## 📜 Scripts

- `bun dev`: Start the development server (Frontend).
- `bun build`: Build the application.
- `bun lint`: Lint the codebase.
- `bun format`: Format code using Prettier.
- `bun check-types`: Run TypeScript type checking.
