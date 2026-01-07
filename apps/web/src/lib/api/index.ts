import axios, { AxiosInstance } from "axios";
import { Auth } from "./auth";
import { Sessions } from "./sessions";
import { useTokenStore, useAuthStore } from "@/store/user.store";

class ApiClient {
  private _axios: AxiosInstance;
  auth: Auth;
  sessions: Sessions;

  constructor(apiUrl: string) {
    this._axios = this.createApiClient(apiUrl);
    this.auth = new Auth(this._axios);
    this.sessions = new Sessions(this._axios);
  }

  private createApiClient(apiUrl: string) {
    const ax = axios.create({
      baseURL: `${apiUrl}/api`,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    // Request interceptor to add auth token
    ax.interceptors.request.use(
      (config) => {
        const token = useTokenStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    ax.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Don't redirect if we're already trying to sign in
          if (!error.config.url?.includes("/auth/signin")) {
            useTokenStore.getState().removeToken();
            useAuthStore.getState().logout();
            if (typeof window !== "undefined") {
              window.location.href = "/signin";
            }
          }
        }
        return Promise.reject(error);
      }
    );
    return ax;
  }
}

const api = new ApiClient(process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000");

export default api;