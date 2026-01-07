import { AxiosInstance } from "axios";
import type {
  ApiResponse,
  CreateSessionResponse,
  ChatRequest,
  ChatResponse,
  SessionsResponse,
  SessionDetailResponse,
} from "@/types/api";

export class Sessions {
  private instance: AxiosInstance;

  constructor(api: AxiosInstance) {
    this.instance = api;
  }

  async createSession(file: File): Promise<ApiResponse<CreateSessionResponse>> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await this.instance.post<ApiResponse<CreateSessionResponse>>(
      "/session/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  }

  async chat(sessionId: string, message: string): Promise<ChatResponse> {
    const payload: ChatRequest = { session_id: sessionId, message };
    const { data } = await this.instance.post<ChatResponse>("/session/chat", payload);
    return data;
  }

  async getSessions(offset?: number, limit?: number): Promise<SessionsResponse> {
    const params = new URLSearchParams();
    if (offset !== undefined) params.append("offset", offset.toString());
    if (limit !== undefined) params.append("limit", limit.toString());
    
    const { data } = await this.instance.get<SessionsResponse>(`/session/?${params.toString()}`);
    return data;
  }

  async getSession(sessionId: string, offset?: number, limit?: number): Promise<SessionDetailResponse> {
    const params = new URLSearchParams();
    if (offset !== undefined) params.append("offset", offset.toString());
    if (limit !== undefined) params.append("limit", limit.toString());

    const { data } = await this.instance.get<SessionDetailResponse>(`/session/${sessionId}?${params.toString()}`);
    return data;
  }
}