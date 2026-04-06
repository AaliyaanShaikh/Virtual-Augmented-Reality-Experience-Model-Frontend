"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { PreviewItem } from "@/app/components/PreviewGrid";

const STORAGE_KEY = "varem-recent-generations";
const MAX_ITEMS = 12;
const THUMB_SIZE = 56;

export type RecentGeneration = {
  id: string;
  title: string;
  thumb: string;
  createdAt: number;
  imageCount: number;
};

function loadFromStorage(): RecentGeneration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentGeneration[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x) =>
        x &&
        typeof x.id === "string" &&
        typeof x.title === "string" &&
        typeof x.thumb === "string",
    );
  } catch {
    return [];
  }
}

function persist(items: RecentGeneration[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

function fileToThumbDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      const s = THUMB_SIZE;
      canvas.width = s;
      canvas.height = s;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("");
        return;
      }
      const { naturalWidth: w, naturalHeight: h } = img;
      if (!w || !h) {
        resolve("");
        return;
      }
      const scale = Math.min(s / w, s / h);
      const dw = w * scale;
      const dh = h * scale;
      ctx.drawImage(img, (s - dw) / 2, (s - dh) / 2, dw, dh);
      try {
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      } catch {
        resolve("");
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve("");
    };
    img.src = url;
  });
}

type RecentGenerationsContextValue = {
  recents: RecentGeneration[];
  addRecentFromPreviews: (items: PreviewItem[]) => Promise<void>;
};

const RecentGenerationsContext =
  createContext<RecentGenerationsContextValue | null>(null);

export function RecentGenerationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recents, setRecents] = useState<RecentGeneration[]>([]);

  useEffect(() => {
    setRecents(loadFromStorage());
  }, []);

  const addRecentFromPreviews = useCallback(async (items: PreviewItem[]) => {
    if (items.length === 0) return;

    const thumb = await fileToThumbDataUrl(items[0].file);
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `gen-${Date.now()}`;

    const baseName = items[0].file.name.replace(/\.[^./\\]+$/, "") || "Generation";
    const title =
      items.length === 1
        ? baseName
        : `${items.length} images · ${baseName}`;

    const next: RecentGeneration = {
      id,
      title,
      thumb,
      createdAt: Date.now(),
      imageCount: items.length,
    };

    setRecents((prev) => {
      const merged = [next, ...prev.filter((p) => p.id !== id)].slice(0, MAX_ITEMS);
      persist(merged);
      return merged;
    });
  }, []);

  const value = useMemo(
    () => ({ recents, addRecentFromPreviews }),
    [recents, addRecentFromPreviews],
  );

  return (
    <RecentGenerationsContext.Provider value={value}>
      {children}
    </RecentGenerationsContext.Provider>
  );
}

export function useRecentGenerations() {
  const ctx = useContext(RecentGenerationsContext);
  if (!ctx) {
    throw new Error(
      "useRecentGenerations must be used within RecentGenerationsProvider",
    );
  }
  return ctx;
}
