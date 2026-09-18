"use client";

import React from "react";

interface FlagProps {
  className?: string;
}

/**
 * High quality, crisp SVG Flag of Cambodia (ព្រះរាជាណាចក្រកម្ពុជា)
 * Standard proportions with Blue stripes and Red center with Angkor Wat silhouette.
 */
export const CambodiaFlag: React.FC<FlagProps> = ({ className = "w-5 h-3.5" }) => {
  return (
    <svg
      viewBox="0 0 640 440"
      className={`inline-block rounded-xs shadow-xs overflow-hidden shrink-0 ${className}`}
      aria-label="Cambodia Flag"
    >
      {/* Top Blue Stripe */}
      <rect width="640" height="110" fill="#032EA6" />
      {/* Middle Red Stripe */}
      <rect y="110" width="640" height="220" fill="#E00025" />
      {/* Bottom Blue Stripe */}
      <rect y="330" width="640" height="110" fill="#032EA6" />

      {/* Angkor Wat White Silhouette */}
      <g fill="#FFFFFF">
        {/* Foundation Base */}
        <rect x="200" y="300" width="240" height="14" rx="1" />
        <rect x="215" y="284" width="210" height="16" rx="1" />
        <rect x="230" y="270" width="180" height="14" rx="1" />

        {/* Central Entrance Gateway */}
        <path d="M312 284h16v16h-16z" fill="#E00025" />

        {/* Center Main Tower */}
        <path d="M316 160l4-16 4 16v110h-8z" />
        <path d="M310 185l10-22 10 22v85h-20z" />
        <path d="M303 210l17-25 17 25v60h-34z" />
        <path d="M296 235l24-25 24 25v35h-48z" />

        {/* Left Tower */}
        <path d="M256 195l4-14 4 14v75h-8z" />
        <path d="M250 215l10-18 10 18v55h-20z" />
        <path d="M244 235l16-20 16 20v35h-32z" />

        {/* Right Tower */}
        <path d="M376 195l4-14 4 14v75h-8z" />
        <path d="M370 215l10-18 10 18v55h-20z" />
        <path d="M364 235l16-20 16 20v35h-32z" />

        {/* Inner Connecting Walls */}
        <rect x="260" y="258" width="120" height="12" />
        {/* Wall Spire Accents */}
        <path d="M280 250l3-8 3 8v8h-6z" />
        <path d="M354 250l3-8 3 8v8h-6z" />
      </g>
    </svg>
  );
};

/**
 * High quality, crisp SVG Flag of the United Kingdom / English
 * Standard Union Jack with Blue, White, and Red crosses.
 */
export const EnglishFlag: React.FC<FlagProps> = ({ className = "w-5 h-3.5" }) => {
  return (
    <svg
      viewBox="0 0 640 440"
      className={`inline-block rounded-xs shadow-xs overflow-hidden shrink-0 ${className}`}
      aria-label="English / UK Flag"
    >
      <clipPath id="uk-clip">
        <rect width="640" height="440" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        <rect width="640" height="440" fill="#012169" />
        {/* Diagonals White */}
        <path
          d="M0 0l640 440m0-440L0 440"
          stroke="#FFFFFF"
          strokeWidth="60"
        />
        {/* Diagonals Red St. Patrick */}
        <path
          d="M0 0l320 220m320 0L320 440m0-220L0 440m320-220l320-220"
          stroke="#C8102E"
          strokeWidth="20"
        />
        {/* Cross White */}
        <path
          d="M320 0v440M0 220h640"
          stroke="#FFFFFF"
          strokeWidth="100"
        />
        {/* Cross Red St. George */}
        <path
          d="M320 0v440M0 220h640"
          stroke="#C8102E"
          strokeWidth="60"
        />
      </g>
    </svg>
  );
};
