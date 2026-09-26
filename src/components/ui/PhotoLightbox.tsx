"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  Camera,
  Sparkles,
} from "lucide-react";

export interface PhotoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  title?: string;
  subtitle?: string;
  badge?: string;
  isRealPhoto?: boolean;
  actionButton?: React.ReactNode;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
  subtitle,
  badge,
  isRealPhoto = false,
  actionButton,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setIsZoomed(false);
  }, [initialIndex, isOpen]);

  const handlePrev = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-200 p-3 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl h-full max-h-[92vh] flex flex-col justify-between select-none">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 text-white pb-3 border-b border-white/10 shrink-0">
          <div className="min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-600/90 text-white backdrop-blur-xs">
                  {badge}
                </span>
              )}
              {isRealPhoto ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Camera className="w-3.5 h-3.5" />
                  <span>រូបថតភ្ជាប់ដោយអតិថិជន</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/15 text-slate-200">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>រូបភាពគំរូតាមប្រភេទសេវា</span>
                </span>
              )}
              {images.length > 1 && (
                <span className="text-xs text-white/60 font-mono">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>
            {title && (
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-white/70 truncate">{subtitle}</p>
            )}
          </div>

          {/* Action buttons (Zoom, New tab, Close) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
              title={isZoomed ? "បង្រួម (Zoom out)" : "ពង្រីក (Zoom in)"}
            >
              {isZoomed ? (
                <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
            <a
              href={currentImage}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition active:scale-95"
              title="បើករូបភាពក្នុងផ្ទាំងថ្មី"
            >
              <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/80 hover:bg-rose-600 text-white transition active:scale-95"
              title="បិទ (Close - Esc)"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Center: Image Display with Previous / Next Arrows */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden my-3 min-h-0">
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-xs transition active:scale-90 hover:scale-105"
              title="រូបភាពមុន (Previous)"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div
            className={`w-full h-full flex items-center justify-center transition-transform duration-300 ${
              isZoomed ? "cursor-zoom-out scale-150 overflow-auto" : "cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={title || "Service photo"}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition duration-200 select-none"
              draggable={false}
            />
          </div>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-xs transition active:scale-90 hover:scale-105"
              title="រូបភាពបន្ទាប់ (Next)"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Bar: Thumbnails & Action */}
        <div className="pt-2 border-t border-white/10 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Thumbnails (if multiple images) */}
          {images.length > 1 ? (
            <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsZoomed(false);
                  }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                    currentIndex === idx
                      ? "border-blue-500 scale-105 shadow-md shadow-blue-500/30"
                      : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-xs text-white/50">
              ចុចលើរូបដើម្បីពង្រីក (Click image to zoom)
            </div>
          )}

          {/* Action button (e.g. View full details / Make offer) */}
          {actionButton && <div className="shrink-0">{actionButton}</div>}
        </div>
      </div>
    </div>
  );
};
