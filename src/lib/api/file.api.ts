import api from "./client";
import { FileUploadResponse, UploadFileType } from "@/types/file";

const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "https://servicemaketplaceapi-production.up.railway.app"
).replace(/\/+$/, "");

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
    if (trimmed.startsWith("/uploads/")) return `${BASE_URL}${trimmed}`;
    if (trimmed.startsWith("uploads/")) return `${BASE_URL}/${trimmed}`;
    if (trimmed.startsWith("/api/v1/files/")) return `${BASE_URL}${trimmed}`;
    if (trimmed.startsWith("api/v1/files/")) return `${BASE_URL}/${trimmed}`;
    if (trimmed.startsWith("/")) return `${BASE_URL}${trimmed}`;

    // If it's a stored file name starting with uploads or containing filename
    return `${BASE_URL}/api/v1/files/${trimmed}`;
  },

  getFileByFilename: (filename?: string | null): string => {
    if (!filename || typeof filename !== "string") return "";
    const trimmed = filename.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `${BASE_URL}/api/v1/files/filename/${encodeURIComponent(trimmed.replace(/^\/+/, ""))}`;
  },

  getUploadUrl: (path?: string | null): string => {
    if (!path || typeof path !== "string") return "";
    const trimmed = path.trim().replace(/^\/+/, "");
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
    return `${BASE_URL}/${trimmed.startsWith("uploads/") ? trimmed : `uploads/${trimmed}`}`;
  },

  deleteFile: (fileId: string) => api.delete<void>(`/api/v1/files/${fileId}`),
};
