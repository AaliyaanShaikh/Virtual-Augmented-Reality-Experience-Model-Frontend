"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "varem-intro-seen";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

export function IntroOverlay() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<
    "pending" | "dots" | "type" | "done"
  >("pending");

  const [typed, setTyped] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (sessionStorage.getItem(STORAGE_KEY)) {
      setPhase("done");
      return;
    }
    if (reducedMotion) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setPhase("done");
      return;
    }
    setPhase("dots");
    const t1 = window.setTimeout(() => setPhase("type"), 900);
    return () => window.clearTimeout(t1);
  }, [mounted, reducedMotion]);

  useEffect(() => {
    if (phase !== "type") return;
    const full = "Welcome…";
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(tick);
        window.setTimeout(() => {
          sessionStorage.setItem(STORAGE_KEY, "1");
          setPhase("done");
        }, 550);
      }
    }, 70);
    return () => window.clearInterval(tick);
  }, [phase]);

  if (!mounted || phase === "pending" || phase === "done") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#171717]"
      aria-live="polite"
    >
      {phase === "dots" && (
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-2 rounded-full bg-neutral-500 animate-intro-dot"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>
      )}
      {phase === "type" && (
        <p className="text-lg font-medium tracking-tight text-neutral-300">
          {typed}
          <span className="inline-block w-2 animate-pulse">▍</span>
        </p>
      )}
    </div>
  );
}
