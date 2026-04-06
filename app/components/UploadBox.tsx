"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";

import { cn } from "@/app/lib/utils";

type UploadBoxProps = {
  onFilesSelected: (files: FileList | File[]) => void;
  disabled?: boolean;
  className?: string;
};

function filesFromInput(list: FileList | File[] | null): File[] {
  if (!list || list.length === 0) return [];
  return Array.from(list).filter((f) => f.type.startsWith("image/"));
}

export function UploadBox({
  onFilesSelected,
  disabled,
  className,
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (list: FileList | File[] | null) => {
      const next = filesFromInput(list);
      if (next.length) onFilesSelected(next);
    },
    [onFilesSelected],
  );

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          if (!disabled) handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "group relative flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed bg-white px-6 py-14 text-center shadow-[var(--shadow-soft)] transition-all duration-300 sm:py-16",
          "border-neutral-300 hover:border-neutral-400 hover:shadow-[var(--shadow-soft-lg)]",
          isDragging &&
            "scale-[1.01] border-neutral-900 bg-neutral-50 shadow-[var(--shadow-soft-lg)]",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-600 transition-all duration-300 sm:size-16",
            "group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white",
            isDragging && "scale-105 bg-neutral-900 text-white",
          )}
          aria-hidden
        >
          <ImagePlus className="size-7 sm:size-8" strokeWidth={1.25} />
        </span>
        <div className="space-y-1.5">
          <p className="text-base font-medium tracking-tight text-neutral-900 sm:text-lg">
            Drop images here or click to browse
          </p>
          <p className="text-sm text-neutral-500">
            PNG, JPG, WebP — add multiple angles for best results
          </p>
        </div>
      </button>
    </div>
  );
}
