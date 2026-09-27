"use client";

import React from "react";

interface LoadingSkeletonProps {
  count?: number;
  viewMode?: "providers" | "requests";
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 6,
  viewMode = "providers",
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col justify-between space-y-4 animate-pulse shadow-2xs"
        >
          {viewMode === "providers" ? (
            <>
              {/* Provider Card Skeleton */}
              <div>
                <div className="flex items-start space-x-3.5 mb-3.5">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-2xl bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2 py-0.5">
                    <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                    <div className="h-3 bg-slate-100 rounded-md w-2/3" />
                  </div>
                </div>

                {/* Details lines */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="h-3 bg-slate-100 rounded-md w-4/5" />
                  <div className="h-3 bg-slate-100 rounded-md w-3/5" />
                  <div className="h-3 bg-slate-100 rounded-md w-2/5" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <div className="h-9 bg-slate-100 rounded-xl flex-1" />
                <div className="h-9 bg-slate-200 rounded-xl flex-1" />
              </div>
            </>
          ) : (
            <>
              {/* Request Card Skeleton */}
              <div>
                <div className="aspect-16/10 bg-slate-200 rounded-xl mb-3.5" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded-md w-4/5" />
                  <div className="h-3 bg-slate-100 rounded-md w-3/5" />
                  <div className="h-3 bg-slate-100 rounded-md w-2/5" />
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="h-3 bg-slate-100 rounded-md w-1/3" />
                <div className="h-4 bg-slate-200 rounded-md w-1/4" />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
