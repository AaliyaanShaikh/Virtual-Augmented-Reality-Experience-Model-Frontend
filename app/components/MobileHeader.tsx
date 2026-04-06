"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import { cn } from "@/app/lib/utils";

type MobileHeaderProps = {
  onMenuClick: () => void;
  className?: string;
};

export function MobileHeader({ onMenuClick, className }: MobileHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between border-b border-white/[0.07] bg-[#141414] px-4 md:hidden",
        className,
      )}
    >
      <Link
        href="/"
        className="font-semibold tracking-tight text-neutral-100 outline-none focus-visible:ring-2 focus-visible:ring-white/15"
      >
        VAREM
      </Link>
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-10 items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-neutral-200"
        aria-label="Open menu"
      >
        <Menu className="size-4" strokeWidth={1.5} />
      </button>
    </header>
  );
}
