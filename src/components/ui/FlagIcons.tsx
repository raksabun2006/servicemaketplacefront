"use client";

import React from "react";

interface FlagProps {
  className?: string;
  isCircle?: boolean;
}

/**
 * Real official Flag of Cambodia (ព្រះរាជាណាចក្រកម្ពុជា)
 * Exact Angkor Wat vector rendering from official standards
 */
export const CambodiaFlag: React.FC<FlagProps> = ({ className = "w-5 h-3.5", isCircle = false }) => {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={isCircle ? "/flags/kh-1x1.svg" : "/flags/kh.svg"}
      alt="Cambodia Flag (ភាសាខ្មែរ)"
      className={`inline-block shrink-0 select-none ${isCircle ? "rounded-full object-cover" : "rounded-xs object-cover shadow-xs"} ${className}`}
      loading="eager"
      draggable={false}
    />
  );
};

/**
 * Real official Flag of the United Kingdom / English (Union Jack)
 */
export const EnglishFlag: React.FC<FlagProps> = ({ className = "w-5 h-3.5", isCircle = false }) => {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={isCircle ? "/flags/gb-1x1.svg" : "/flags/gb.svg"}
      alt="English / UK Flag"
      className={`inline-block shrink-0 select-none ${isCircle ? "rounded-full object-cover" : "rounded-xs object-cover shadow-xs"} ${className}`}
      loading="eager"
      draggable={false}
    />
  );
};

