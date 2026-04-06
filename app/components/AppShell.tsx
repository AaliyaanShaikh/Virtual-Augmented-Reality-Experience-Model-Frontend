"use client";

import { useEffect, useState } from "react";

import { MobileHeader } from "@/app/components/MobileHeader";
import { Sidebar } from "@/app/components/Sidebar";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <div className="flex min-h-dvh">
      <Sidebar className="hidden md:flex" />

      {drawerOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 flex md:hidden">
            <Sidebar className="h-dvh min-h-0 shadow-2xl" />
          </div>
        </>
      )}

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col bg-[#171717]">
        <MobileHeader onMenuClick={() => setDrawerOpen(true)} />
        {children}
      </div>
    </div>
  );
}
