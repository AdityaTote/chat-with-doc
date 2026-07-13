# API Reference

All endpoints are mounted under `/api`. Protected routes require:

```
Authorization: Bearer <token>
```

---

## Auth

| Method | Path | Auth | Body |
|---|---|---|---|
| `POST` | `/api/auth/signup` | — | `{ "email": str, "password": str }` |
| `POST` | `/api/auth/signin` | — | `{ "email": str, "password": str }` |

**Response (both):**
```json
{
  "success": true,
  "message": "user signed in successfully",
  "data": { "token": "eyJhbGci..." }
}
```

---

## Sessions

| Method | Path | Auth | Query Params | Description |
|---|---|---|---|---|
| `POST` | `/api/session/create` | ✓ | — | Upload a document; creates a session |
| `GET` | `/api/session/` | ✓ | `limit`, `offset` | List user's sessions (paginated) |
| `GET` | `/api/session/{session_id}` | ✓ | `limit`, `offset` | Get session + paginated chat history |
| `POST` | `/api/session/chat` | ✓ | — | Send a message; returns RAG-grounded answer |

### POST /api/session/create

**Request:** `multipart/form-data` with `file` field.

**Response:**
```json
{
  "success": true,
  "message": "file uploaded successfully",
  "data": {
    "doc_id": 12,
    "doc_key": "uploads/a3f5c8d1-....pdf",
    "doc_url": "https://d1234abc.cloudfront.net/uploads/a3f5c8d1-....pdf",
    "session_id": 7,
    "session_token": "b2e9f3a0-1234-..."
  }
}
```

### POST /api/session/chat

**Request:**
```json
{
  "session_id": "<session_token UUID>",
  "message": "What were the key revenue drivers in Q3?"
}
```

**Response:**
```json
{
  "success": true,
  "message": "chat message processed successfully",
  "data": {
    "response": "Based on the document, the key Q3 revenue drivers were...",
    "highlight_text": [
      "Revenue increased by 18% YoY, driven primarily by...",
      "The APAC segment contributed 34% of total Q3 revenue..."
    ],
    "document": {
      "id": 12,
      "key": "uploads/a3f5c8d1-....pdf",
      "title": "annual_report.pdf",
      "url": "https://d1234abc.cloudfront.net/...",
      "content_type": "pdf"
    }
  }
}
```

> `highlight_text` — 2 document chunks nearest to the LLM answer (second vector pass). Used by the frontend to highlight source passages.

---

## Observability

| Method | Path | Description |
|---|---|---|
| `GET` | `/metrics` | Prometheus text exposition (request count, latency histogram) |
| `GET` | `/docs` | Auto-generated Swagger UI |
| `GET` | `/redoc` | ReDoc API reference |
