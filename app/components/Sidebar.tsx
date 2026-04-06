"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Home, Layers, Sparkles } from "lucide-react";

import { MemberActions } from "@/app/components/MemberActions";
import { cn } from "@/app/lib/utils";

const primaryNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "#", label: "Projects", icon: FolderOpen },
  { href: "#", label: "Models", icon: Layers },
  { href: "#", label: "Explore", icon: Sparkles },
];

const recents = [
  { label: "Chair scan — draft", href: "#" },
  { label: "Product set A", href: "#" },
  { label: "AR showroom", href: "#" },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 w-[240px] shrink-0 flex-col border-r border-white/[0.07] bg-[#141414] md:h-dvh",
        className,
      )}
    >
      <div className="border-b border-white/[0.07] px-4 py-5">
        <Link
          href="/"
          className="block font-semibold tracking-tight text-neutral-100 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/15 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
        >
          VAREM
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-2 py-4">
        <p className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-600">
          Workspace
        </p>
        <ul className="space-y-0.5">
          {primaryNav.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : false;
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors",
                    active
                      ? "bg-white/[0.06] text-neutral-100"
                      : "text-neutral-500 hover:bg-white/[0.04] hover:text-neutral-300",
                  )}
                >
                  <Icon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 px-2">
          <p className="pb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-600">
            Recents
          </p>
          <ul className="space-y-1">
            {recents.map((r) => (
              <li key={r.label}>
                <Link
                  href={r.href}
                  className="block truncate rounded-lg px-2 py-1.5 text-sm text-neutral-500 transition-colors hover:bg-white/[0.03] hover:text-neutral-400"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="shrink-0 border-t border-white/[0.07] px-4 pb-4 pt-3">
        <MemberActions />
      </div>
    </aside>
  );
}
