"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ImagePlus } from "lucide-react";

import { cn } from "@/app/lib/utils";

export type UploadBoxHandle = {
  open: () => void;
};

type UploadBoxProps = {
  onFilesSelected: (files: FileList | File[]) => void;
  disabled?: boolean;
  className?: string;
};

function filesFromInput(list: FileList | File[] | null): File[] {
  if (!list || list.length === 0) return [];
  return Array.from(list).filter((f) => f.type.startsWith("image/"));
}

export const UploadBox = forwardRef<UploadBoxHandle, UploadBoxProps>(
  function UploadBox({ onFilesSelected, disabled, className }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => inputRef.current?.click(),
    }));

    const handleFiles = useCallback(
      (list: FileList | File[] | null) => {
        const next = filesFromInput(list);
        if (next.length) onFilesSelected(next);
      },
      [onFilesSelected],
    );

    return (
      <div className={cn("w-full max-w-[672px]", className)}>
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
            "group relative flex w-full flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-white/[0.12] bg-[#262626]/50 px-6 py-12 text-center transition-all duration-300 sm:py-14",
            "hover:border-white/[0.18] hover:bg-[#2a2a2a]/60",
            isDragging &&
              "scale-[1.01] border-white/[0.22] bg-[#2a2a2a]/80 ring-2 ring-white/[0.08]",
            disabled && "pointer-events-none opacity-50",
          )}
        >
          <span
            className={cn(
              "flex size-14 items-center justify-center rounded-2xl bg-[#141414] text-neutral-500 ring-1 ring-white/[0.08] transition-all duration-300 sm:size-16",
              "group-hover:text-neutral-300 group-hover:ring-white/[0.12]",
              isDragging && "text-neutral-200",
            )}
            aria-hidden
          >
            <ImagePlus className="size-7 sm:size-8" strokeWidth={1.5} />
          </span>
          <div className="space-y-1.5">
            <p className="text-base font-medium tracking-tight text-neutral-200 sm:text-[15px]">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-neutral-600">
              PNG, JPG, WebP — multiple angles recommended
            </p>
          </div>
        </button>
      </div>
    );
  },
);
