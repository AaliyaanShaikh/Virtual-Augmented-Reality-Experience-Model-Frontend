"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { AppShell } from "@/app/components/AppShell";
import { Button } from "@/app/components/Button";
import { ConsoleFooter } from "@/app/components/ConsoleFooter";
import { Hero } from "@/app/components/Hero";
import { IntroOverlay } from "@/app/components/IntroOverlay";
import { type PreviewItem } from "@/app/components/PreviewGrid";
import { UploadBox, type UploadBoxHandle } from "@/app/components/UploadBox";
import Viewer from "@/app/components/Viewer";
import {
  RecentGenerationsProvider,
  useRecentGenerations,
} from "@/app/context/recent-generations-context";

const GENERATE_API_URL = "http://127.0.0.1:8000/generate";

/** Shape returned by `/generate` (adjust if your API differs). */
type GenerateResponse = {
  message?: string;
  count?: number;
  filenames?: string[];
};

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

function HomeWorkspace() {
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const modelUrlRef = useRef<string | null>(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const uploadRef = useRef<UploadBoxHandle>(null);
  const { addRecentFromPreviews } = useRecentGenerations();

  const replaceModelUrl = useCallback((url: string | null) => {
    if (modelUrlRef.current) {
      URL.revokeObjectURL(modelUrlRef.current);
      modelUrlRef.current = null;
    }
    if (url) modelUrlRef.current = url;
    setModelUrl(url);
  }, []);

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
      if (modelUrlRef.current) {
        URL.revokeObjectURL(modelUrlRef.current);
        modelUrlRef.current = null;
      }
    };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!items.length) return;

    const formData = new FormData();
    items.forEach((item) => {
      formData.append("images", item.file);
    });

    try {
      setLoading(true);

      const res = await fetch(GENERATE_API_URL, {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") ?? "";

      if (!res.ok) {
        try {
          const err = await res.json();
          console.error(err);
        } catch {
          console.error(res.status, res.statusText);
        }
        return;
      }

      if (contentType.includes("application/json")) {
        const data = (await res.json()) as GenerateResponse;

        console.log(data);

        setResponse(data);

        await addRecentFromPreviews(items);
      } else {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        replaceModelUrl(url);

        setResponse(null);

        await addRecentFromPreviews(items);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [items, addRecentFromPreviews, replaceModelUrl]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-10 md:px-8 md:py-14">
          <Hero className="animate-fade-in-up opacity-0" />

          <div className="mt-10 flex w-full flex-col items-center gap-8">
            <UploadBox
              ref={uploadRef}
              items={items}
              onRemove={removeItem}
              onFilesSelected={addFiles}
            />
            <Button
              type="button"
              disabled={items.length === 0 || loading}
              className="min-w-[220px] rounded-2xl"
              onClick={() => void handleGenerate()}
            >
              {loading ? "Generating…" : "Generate 3D Model"}
            </Button>

            {response != null && (
              <div className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#262626]/90 px-4 py-4 text-left text-sm text-neutral-300 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Response
                </p>
                {response.message != null && (
                  <p className="mt-3">
                    <strong className="font-medium text-neutral-200">Message:</strong>{" "}
                    {response.message}
                  </p>
                )}
                {response.count != null && (
                  <p className="mt-2">
                    <strong className="font-medium text-neutral-200">Count:</strong>{" "}
                    {response.count}
                  </p>
                )}
                {response.filenames != null && response.filenames.length > 0 && (
                  <p className="mt-2 break-words">
                    <strong className="font-medium text-neutral-200">Files:</strong>{" "}
                    {response.filenames.join(", ")}
                  </p>
                )}
              </div>
            )}

            {modelUrl != null && (
              <div className="mt-4 w-full">
                <h2 className="mb-4 text-center text-lg font-medium text-neutral-200">
                  Your 3D Model
                </h2>
                <Viewer modelUrl={modelUrl} />
              </div>
            )}
          </div>
        </div>
      </main>
      <ConsoleFooter />
    </div>
  );
}

export default function Home() {
  return (
    <RecentGenerationsProvider>
      <IntroOverlay />
      <AppShell>
        <HomeWorkspace />
      </AppShell>
    </RecentGenerationsProvider>
  );
}
