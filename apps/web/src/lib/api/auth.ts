import { AxiosInstance } from "axios";
import type { AuthRequest, AuthResponse } from "@/types/api";

export class Auth {
  private instance: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.instance = axios;
  }

  async signup(input: AuthRequest): Promise<AuthResponse> {
    const { data } = await this.instance.post<AuthResponse>("/auth/signup", input);
    return data;
  }

  async signin(input: AuthRequest): Promise<AuthResponse> {
    const { data } = await this.instance.post<AuthResponse>("/auth/signin", input);
    return data;
  }

  async me(): Promise<AuthResponse> {
    const { data } = await this.instance.get<AuthResponse>("/auth/me");
    return data;
  }
}