"use client";

import Image from "next/image";
import { X } from "lucide-react";

import { cn } from "@/app/lib/utils";

export type PreviewItem = {
  id: string;
  file: File;
  url: string;
};

type PreviewGridProps = {
  items: PreviewItem[];
  onRemove: (id: string) => void;
  className?: string;
};

export function PreviewGrid({ items, onRemove, className }: PreviewGridProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("w-full max-w-3xl", className)}>
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
        Selected ({items.length})
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {items.map((item) => (
          <li key={item.id} className="group relative aspect-square">
            <div
              className={cn(
                "relative h-full overflow-hidden rounded-2xl bg-neutral-100 shadow-[var(--shadow-soft)] ring-1 ring-black/[0.04] transition-all duration-300",
                "group-hover:scale-[1.02] group-hover:shadow-[var(--shadow-soft-lg)]",
              )}
            >
              <Image
                src={item.url}
                alt={item.file.name || "Upload preview"}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(min-width: 640px) 33vw, 50vw"
                unoptimized
              />
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className={cn(
                  "absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/55 text-white shadow-lg backdrop-blur-sm transition-all duration-200",
                  "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                  "hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80",
                )}
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>
            <p className="mt-2 truncate px-0.5 text-center text-xs text-neutral-500">
              {item.file.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
