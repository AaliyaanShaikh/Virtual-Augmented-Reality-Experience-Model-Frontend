"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Navbar } from "@/app/components/Navbar";
import { PreviewGrid, type PreviewItem } from "@/app/components/PreviewGrid";
import { UploadBox } from "@/app/components/UploadBox";
import { Button } from "@/app/components/Button";

function createPreviewItems(files: File[]): PreviewItem[] {
  return files.map((file) => ({
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
    file,
    url: URL.createObjectURL(file),
  }));
}

export default function Home() {
  const [items, setItems] = useState<PreviewItem[]>([]);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const list = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setItems((prev) => [...prev, ...createPreviewItems(list)]);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  useEffect(() => {
    return () => {
      itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url));
    };
  }, []);

  return (
    <div className="relative min-h-dvh overflow-x-hidden">
      <Navbar />

      <main className="flex min-h-dvh flex-col items-center justify-center px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
        <div className="animate-fade-in-up flex w-full max-w-4xl flex-col items-center text-center opacity-0">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-neutral-400 sm:text-[0.7rem]">
            Image to 3D
          </p>
          <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl md:leading-[1.1]">
            Create 3D Models from Images
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-neutral-500 sm:text-lg">
            Upload images and generate immersive AR/VR models instantly
          </p>

          <div className="mt-12 flex w-full flex-col items-center gap-10 sm:mt-14 sm:gap-12">
            <UploadBox onFilesSelected={addFiles} />
            <PreviewGrid items={items} onRemove={removeItem} />
            <Button
              type="button"
              disabled={items.length === 0}
              className="min-w-[200px]"
              onClick={() => {
                /* backend wiring later */
              }}
            >
              Generate 3D Model
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
