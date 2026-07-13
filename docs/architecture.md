# Architecture

## Ingestion Pipeline

```
Client (Next.js)
    │  POST /api/session/create  (multipart/form-data)
    ▼
FastAPI [auth_middleware → session route]
    ├── Validate MIME type against allowlist
    ├── S3Client.generate_put_presigned_url()  →  S3 object key
    ├── S3Client.upload_file_to_presigned_url()  →  CloudFront URL
    ├── Persist Document row (key, url, content_type, user_id)
    ├── Persist Session row  (session_token UUID, document_id, user_id)
    ├── Rag.store()  [synchronous]
    │       ├── DocumentLoader.load(key)
    │       │     ├── boto3 s3.get_object(key)
    │       │     └── Per-type extractor:
    │       │           PDF  → PyMuPDF (fitz), one Document per page
    │       │           DOCX → python-docx, paragraphs joined
    │       │           PPTX → python-pptx
    │       │           XLSX → openpyxl
    │       │           TXT / MD → raw text
    │       ├── chunk_doc()  →  RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    │       ├── generate_embeddings()  →  fastembed (local, no API call)
    │       └── chromadb.add(ids, embeddings, documents, metadatas{doc_id, chunk_index, doc_type})
    └── background_tasks.add_task(Rag.generate_session_name)
              └── Fetch 2 chunks from Chroma → Gemini → session.title
```

## Query Pipeline

```
Client
    │  POST /api/session/chat  { session_id, message }
    ▼
FastAPI [auth_middleware → SessionService.chat()]
    ├── Load Session + Document from PostgreSQL (joinedload)
    ├── Fetch last 2 Chat rows (latest user + assistant turns)
    ├── Rag.query(RagQuery)
    │       ├── generate_embeddings([query])
    │       ├── chromadb.query(embeddings, n_results=5, where={doc_id})
    │       └── llm_response(LlmQuery)
    │               ├── SystemMessage  — 8-rule document assistant prompt
    │               ├── HumanMessage   — retrieved chunk context (top-5)
    │               ├── [History]      — previous 2 turns injected before user msg
    │               └── HumanMessage   — current question
    │               → ChatGoogleGenerativeAI(model="gemini-2.5-flash").invoke()
    ├── Rag.extract_text_from_doc(answer)
    │       └── Embed answer → Chroma query(n_results=2) → highlight_text
    ├── Persist user Chat row  (role=USER)
    ├── Persist assistant Chat row  (role=ASSISTANT)
    └── Return { response, highlight_text, document{...} }
```

## Database Schema

```
users          sessions                     documents                  chats
──────         ──────────────────────       ────────────────────────   ─────────────────────────────
id (PK)        id (PK)                      id (PK)                    id (PK)
email          session_token (UUID, idx)    key (S3 object key)        session_id (FK→sessions.session_token)
password_hash  title (nullable)             url (CloudFront URL)       message
               document_id (FK→documents)   content_type (enum)        role (user|assistant)
               user_id (FK→users)           user_id (FK→users)         created_at
               created_at / updated_at      created_at / updated_at
```

## Supported File Types

| MIME Type | Extension | Parser |
|---|---|---|
| `application/pdf` | `.pdf` | PyMuPDF — per-page extraction with word/char count metadata |
| `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `.docx` | `python-docx` — paragraph-level |
| `application/vnd.openxmlformats-officedocument.presentationml.presentation` | `.pptx` | `python-pptx` |
| `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` | `.xlsx` | `openpyxl` |
| `text/plain` | `.txt` | Raw text |
| `text/markdown` | `.md` | Raw text |
