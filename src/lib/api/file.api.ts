import api from "./client";
import { FileUploadResponse, UploadFileType } from "@/types/file";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

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
    if (trimmed.startsWith("/api/v1/files/")) return `${BASE_URL}${trimmed}`;
    if (trimmed.startsWith("api/v1/files/")) return `${BASE_URL}/${trimmed}`;
    if (trimmed.startsWith("/")) return `${BASE_URL}${trimmed}`;
    return `${BASE_URL}/api/v1/files/${trimmed}`;
  },

  deleteFile: (fileId: string) => api.delete<void>(`/api/v1/files/${fileId}`),
};
