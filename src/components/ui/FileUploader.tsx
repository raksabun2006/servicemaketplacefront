"use client";

import React, { useState } from "react";
import { fileApi } from "@/lib/api/file.api";
import { UploadFileType } from "@/types/file";
import { Upload, X, Loader2 } from "lucide-react";

interface FileUploaderProps {
  fileType?: UploadFileType;
  onUploaded: (fileId: string, url?: string) => void;
  label?: string;
  accept?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  fileType = "REQUEST_IMAGE",
  onUploaded,
  label = "បញ្ចូលរូបភាព",
  accept = "image/*",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("ទំហំឯកសារមិនត្រូវលើសពី 10MB ទេ។");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      const res = await fileApi.upload(file, fileType);
      const fileUrl = fileApi.getFileUrl(res.url || res.id);
      setUploadedUrl(fileUrl);
      onUploaded(res.id, fileUrl);
    } catch {
      setError("ការបញ្ចូលរូបភាពបានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setUploadedUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      {uploadedUrl ? (
        <div className="relative inline-block border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={uploadedUrl} alt="Uploaded" className="w-24 h-24 object-cover" />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <label className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex items-center space-x-2 text-indigo-600 text-xs font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>កំពុងបញ្ចូល...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1 text-slate-500">
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-xs font-medium">{label}</span>
              <span className="text-[10px] text-slate-400">PNG, JPG ឬ WEBP (រហូតដល់ 10MB)</span>
            </div>
          )}
        </label>
      )}

      {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
