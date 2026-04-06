"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { ImagePlus, Plus, X } from "lucide-react";

import type { PreviewItem } from "@/app/components/PreviewGrid";
import { cn } from "@/app/lib/utils";

export type UploadBoxHandle = {
  open: () => void;
};

type UploadBoxProps = {
  items: PreviewItem[];
  onRemove: (id: string) => void;
  onFilesSelected: (files: FileList | File[]) => void;
  disabled?: boolean;
  className?: string;
};

function filesFromInput(list: FileList | File[] | null): File[] {
  if (!list || list.length === 0) return [];
  return Array.from(list).filter((f) => f.type.startsWith("image/"));
}

export const UploadBox = forwardRef<UploadBoxHandle, UploadBoxProps>(
  function UploadBox(
    { items, onRemove, onFilesSelected, disabled, className },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => inputRef.current?.click(),
    }));

    const openPicker = useCallback(() => {
      inputRef.current?.click();
    }, []);

    const handleFiles = useCallback(
      (list: FileList | File[] | null) => {
        const next = filesFromInput(list);
        if (next.length) onFilesSelected(next);
      },
      [onFilesSelected],
    );

    const shellClass = cn(
      "relative w-full rounded-2xl border-2 border-dashed border-white/[0.12] bg-[#262626]/50 text-center transition-all duration-300",
      "hover:border-white/[0.18] hover:bg-[#2a2a2a]/60",
      isDragging &&
        "scale-[1.005] border-white/[0.22] bg-[#2a2a2a]/80 ring-2 ring-white/[0.08]",
      disabled && "pointer-events-none opacity-50",
    );

    return (
      <div className={cn("w-full max-w-5xl", className)}>
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

        <div
          className={shellClass}
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
        >
          {items.length === 0 ? (
            <button
              type="button"
              disabled={disabled}
              onClick={openPicker}
              className="group flex w-full flex-col items-center justify-center gap-4 px-6 py-12 sm:py-14"
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
          ) : (
            <div className="flex w-full flex-col gap-3 px-4 py-3 sm:px-5">
              <p className="text-left text-[11px] font-medium uppercase tracking-wider text-neutral-600">
                Selected ({items.length}) · scroll sideways if needed
              </p>
              <div className="min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15">
                <ul className="flex flex-nowrap items-center gap-2 pb-0.5">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="group relative shrink-0"
                      title={item.file.name}
                    >
                      <div
                        className={cn(
                          "relative size-16 overflow-hidden rounded-lg bg-[#141414] ring-1 ring-white/[0.08] transition-all duration-300 sm:size-[4.5rem]",
                          "group-hover:ring-white/[0.14]",
                        )}
                      >
                        <Image
                          src={item.url}
                          alt={item.file.name || "Preview"}
                          fill
                          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                          sizes="72px"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemove(item.id);
                          }}
                          className={cn(
                            "absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-black/65 text-neutral-200 ring-1 ring-white/15 backdrop-blur-sm",
                            "opacity-100 sm:opacity-0 sm:group-hover:opacity-100",
                            "hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35",
                          )}
                          aria-label={`Remove ${item.file.name}`}
                        >
                          <X className="size-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    </li>
                  ))}

                  <li className="shrink-0">
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={openPicker}
                      className={cn(
                        "flex size-16 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-white/[0.16] bg-[#1a1a1a]/70 text-neutral-500 transition-all duration-200 sm:size-[4.5rem]",
                        "hover:border-white/[0.24] hover:bg-white/[0.06] hover:text-neutral-300",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
                      )}
                      aria-label="Add more images"
                    >
                      <Plus className="size-5 shrink-0 sm:size-6" strokeWidth={1.5} aria-hidden />
                      <span className="text-[9px] font-medium leading-none text-neutral-500 sm:text-[10px]">
                        Add
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
              <p className="text-center text-[11px] text-neutral-600">
                Wide strip · short previews in one row · drop or tap Add
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);
