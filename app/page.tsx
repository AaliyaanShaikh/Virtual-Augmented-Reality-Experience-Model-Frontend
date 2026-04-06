"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AppShell } from "@/app/components/AppShell";
import { Button } from "@/app/components/Button";
import { ConsoleFooter } from "@/app/components/ConsoleFooter";
import { Hero } from "@/app/components/Hero";
import { IntroOverlay } from "@/app/components/IntroOverlay";
import { PreviewGrid, type PreviewItem } from "@/app/components/PreviewGrid";
import { UploadBox, type UploadBoxHandle } from "@/app/components/UploadBox";

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
  const uploadRef = useRef<UploadBoxHandle>(null);

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
    <>
      <IntroOverlay />
      <AppShell>
        <div className="flex min-h-0 flex-1 flex-col">
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto flex w-full max-w-[720px] flex-col items-center px-4 py-10 md:px-8 md:py-14">
              <Hero className="animate-fade-in-up opacity-0" />

              <div className="mt-10 flex w-full flex-col items-center gap-8">
                <UploadBox ref={uploadRef} onFilesSelected={addFiles} />
                <PreviewGrid items={items} onRemove={removeItem} />
                <Button
                  type="button"
                  disabled={items.length === 0}
                  className="min-w-[220px] rounded-2xl"
                  onClick={() => {
                    /* backend wiring later */
                  }}
                >
                  Generate 3D Model
                </Button>
              </div>
            </div>
          </main>
          <ConsoleFooter />
        </div>
      </AppShell>
    </>
  );
}
