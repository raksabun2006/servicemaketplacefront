import api from "./client";
import { FileUploadResponse, UploadFileType } from "@/types/file";

const getPublicApiPrefix = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }
  if (process.env.BACKEND_API_URL) {
    return process.env.BACKEND_API_URL.replace(/\/+$/, "");
  }
  return "https://servicemaketplaceapi-production.up.railway.app";
};

export const fileApi = {
  upload: (file: File, fileType: UploadFileType = "OTHER") => {
    const formData = new FormData();
    formData.append("file", file);
    return api.upload<FileUploadResponse>(`/api/v1/files/upload?fileType=${fileType}`, formData);
  },

  getFileUrl: (fileIdOrUrl?: string | null): string => {
    if (!fileIdOrUrl || typeof fileIdOrUrl !== "string") return "";
    const trimmed = fileIdOrUrl.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) return trimmed;

    const prefix = getPublicApiPrefix();

    if (trimmed.startsWith("/uploads/")) return `${prefix}${trimmed}`;
    if (trimmed.startsWith("uploads/")) return `${prefix}/${trimmed}`;
    if (trimmed.startsWith("/api/v1/files/")) return `${prefix}${trimmed}`;
    if (trimmed.startsWith("api/v1/files/")) return `${prefix}/${trimmed}`;
    if (trimmed.startsWith("/")) return `${prefix}${trimmed}`;

    // If it's a stored file name starting with uploads or containing filename
    return `${prefix}/api/v1/files/${trimmed}`;
  },

  getFileByFilename: (filename?: string | null): string => {
    if (!filename || typeof filename !== "string") return "";
    const trimmed = filename.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    const prefix = getPublicApiPrefix();
    return `${prefix}/api/v1/files/filename/${encodeURIComponent(trimmed.replace(/^\/+/, ""))}`;
  },

  getUploadUrl: (path?: string | null): string => {
    if (!path || typeof path !== "string") return "";
    const trimmed = path.trim().replace(/^\/+/, "");
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    const prefix = getPublicApiPrefix();
    return `${prefix}/${trimmed.startsWith("uploads/") ? trimmed : `uploads/${trimmed}`}`;
  },

  deleteFile: (fileId: string) => api.delete<void>(`/api/v1/files/${fileId}`),
};
