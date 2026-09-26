import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { generateBreadcrumbsJsonLd } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export interface BreadcrumbItem {
  name: string;
  url?: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHomeIcon = true,
  className = "",
}) => {
  const normalizedItems = items.map((i) => ({
    name: i.name,
    url: i.url || i.href || "/",
  }));

  const allItems = [
    { name: "ទំព័រដើម", url: "/" },
    ...normalizedItems.filter((i) => i.url !== "/" && i.name !== "ទំព័រដើម"),
  ];

  const jsonLdData = generateBreadcrumbsJsonLd(allItems);

  return (
    <>
      <JsonLd data={jsonLdData} />
      <nav
        aria-label="Breadcrumb"
        className={`flex items-center text-xs text-slate-500 overflow-x-auto scrollbar-none py-2 ${className}`}
      >
        <ol className="flex items-center space-x-1.5 whitespace-nowrap">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isHome = index === 0;

            return (
              <li key={item.url} className="flex items-center space-x-1.5">
                {index > 0 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}

                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.url}
                    className="hover:text-blue-600 transition flex items-center space-x-1 text-slate-500"
                  >
                    {isHome && showHomeIcon && <Home className="w-3.5 h-3.5 shrink-0" />}
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};
