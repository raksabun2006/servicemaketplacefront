"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  totalReviews?: number;
  editable?: boolean;
  onChange?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  totalReviews,
  editable = false,
  onChange,
  size = "md",
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  const currentScore = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!editable}
            onClick={() => editable && onChange && onChange(star)}
            onMouseEnter={() => editable && setHoverRating(star)}
            onMouseLeave={() => editable && setHoverRating(null)}
            className={`${editable ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"} p-0.5`}
          >
            <Star
              className={`${starSizes[size]} ${
                star <= currentScore
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-100 text-slate-300"
              } transition-colors`}
            />
          </button>
        ))}
      </div>
      {rating > 0 && !editable && (
        <span className="text-xs font-bold text-slate-700 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
      {totalReviews !== undefined && (
        <span className="text-xs text-slate-500">
          ({totalReviews})
        </span>
      )}
    </div>
  );
};
