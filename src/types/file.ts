export type UploadFileType =
  | "AVATAR"
  | "PROVIDER_DOCUMENT"
  | "SERVICE_IMAGE"
  | "REQUEST_IMAGE"
  | "PORTFOLIO_IMAGE"
  | "OTHER";

export interface FileUploadResponse {
  id: string;
  fileName: string;
  originalFileName?: string;
  contentType?: string;
  sizeBytes?: number;
  url?: string;
  fileType?: UploadFileType;
  createdAt?: string;
}
