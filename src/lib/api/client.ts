import { ApiError } from "@/types/api";

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    return "";
  }
  return (process.env.BACKEND_API_URL || "http://localhost:8080").replace(/\/+$/, "");
}

function resolveRequestUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    const url = new URL(path);
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          url.searchParams.append(key, String(val));
        }
      });
    }
    return url.toString();
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getBaseUrl();

  const baseForUrlConstructor =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  const url = new URL(normalizedPath, baseForUrlConstructor);

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.append(key, String(val));
      }
    });
  }

  if (typeof window !== "undefined" && !process.env.NEXT_PUBLIC_API_URL) {
    return `${url.pathname}${url.search}`;
  }

  return url.toString();
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("accessToken", token);
      } else {
        localStorage.removeItem("accessToken");
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
    }
    return this.token;
  }

  private getHeaders(isFormData = false): Record<string, string> {
    const headers: Record<string, string> = {};
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return {} as T;
    }

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      if (response.status === 401) {
        // If 401, remove invalid token
        if (typeof window !== "undefined") {
          this.setToken(null);
          localStorage.removeItem("user");
        }
      }

      const error: ApiError = {
        status: response.status,
        message:
          (typeof data === "object" && data !== null && (data.message || data.error)) ||
          response.statusText ||
          "មានបញ្ហាក្នុងការដំណើរការសំណើរបស់អ្នក។",
        errors: typeof data === "object" && data !== null ? data.errors : undefined,
      };
      throw error;
    }

    return data as T;
  }

  public async get<T>(path: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<T> {
    const requestUrl = resolveRequestUrl(path, params);

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  public async post<T>(path: string, body?: unknown): Promise<T> {
    const requestUrl = resolveRequestUrl(path);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: this.getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  public async put<T>(path: string, body?: unknown): Promise<T> {
    const requestUrl = resolveRequestUrl(path);
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: this.getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  public async patch<T>(path: string, body?: unknown): Promise<T> {
    const requestUrl = resolveRequestUrl(path);
    const response = await fetch(requestUrl, {
      method: "PATCH",
      headers: this.getHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  public async delete<T>(path: string): Promise<T> {
    const requestUrl = resolveRequestUrl(path);
    const response = await fetch(requestUrl, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  public async upload<T>(path: string, formData: FormData): Promise<T> {
    const requestUrl = resolveRequestUrl(path);
    const response = await fetch(requestUrl, {
      method: "POST",
      headers: this.getHeaders(true),
      body: formData,
    });

    return this.handleResponse<T>(response);
  }

  public async putFormData<T>(path: string, formData: FormData): Promise<T> {
    const requestUrl = resolveRequestUrl(path);
    const response = await fetch(requestUrl, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: formData,
    });

    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient();
export default api;
