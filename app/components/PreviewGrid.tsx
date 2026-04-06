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
    <div className={cn("w-full max-w-[672px]", className)}>
      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-wider text-neutral-600">
        Selected ({items.length})
      </p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {items.map((item) => (
          <li key={item.id} className="group relative aspect-square">
            <div
              className={cn(
                "relative h-full overflow-hidden rounded-2xl bg-[#141414] ring-1 ring-white/[0.08] transition-all duration-300",
                "group-hover:ring-white/[0.12]",
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
                  "absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-neutral-200 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-200",
                  "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                  "hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30",
                )}
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>
            </div>
            <p className="mt-2 truncate px-0.5 text-center text-xs text-neutral-600">
              {item.file.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
