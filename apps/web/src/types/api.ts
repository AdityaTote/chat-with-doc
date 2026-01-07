// Auth types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

// Session types
export interface CreateSessionResponse {
  doc_id: number;
  doc_key: string;
  doc_url: string;
  session_id: number;
  session_token: string;
}

export interface Session {
  id: number;
  title: string | null;
  session_token: string;
  document_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// Session detail types (for /session/{session_id} endpoint)
export interface SessionChat {
  id: number;
  session_id: string;
  message: string;
  role: "user" | "assistant";
  created_at: string;
}

export interface SessionDetailResponse {
  success: boolean;
  message: string;
  data: {
    chats: SessionChat[];
    session: Session & { document_name?: string; document_url?: string };
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  data: {
    response: string;
    history: ChatMessage[];
  };
}

export interface SessionsResponse {
  success: boolean;
  message: string;
  data: {
    sessions: Session[];
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
