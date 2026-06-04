import type { ApiError } from "@/types";
import { getAccessToken, setAccessToken, clearAccessToken } from "./auth-storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

class ApiClientError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: ApiError["details"]
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers = new Headers(options.headers);

  if (auth) {
    const token = getAccessToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const json = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !json.success) {
    throw new ApiClientError(
      json.error?.code ?? "REQUEST_FAILED",
      json.error?.message ?? "Request failed",
      response.status,
      json.error?.details
    );
  }

  return json.data as T;
}

export const api = {
  register(body: { email: string; password: string; name?: string }) {
    return request<import("@/types").AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  login(body: { email: string; password: string }) {
    return request<import("@/types").AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  logout() {
    return request<void>("/api/v1/auth/logout", { method: "POST" }, true);
  },

  me() {
    return request<import("@/types").User>("/api/v1/auth/me", {}, true);
  },

  uploadResume(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return request<import("@/types").UploadResponse>(
      "/api/upload",
      { method: "POST", body: formData },
      true
    );
  },

  analyze(body: {
    resumeText: string;
    jobDescription: string;
    resumeFileName?: string;
  }) {
    return request<import("@/types").AnalyzeResponse>(
      "/api/analyze",
      { method: "POST", body: JSON.stringify(body) },
      true
    );
  },

  listAnalyses() {
    return request<import("@/types").AnalysisRecord[]>("/api/analyses", {}, true);
  },

  saveToken(token: string) {
    setAccessToken(token);
  },

  clearToken() {
    clearAccessToken();
  },
};

export { ApiClientError };
