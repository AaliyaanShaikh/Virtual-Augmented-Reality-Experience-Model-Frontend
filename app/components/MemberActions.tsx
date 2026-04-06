import Link from "next/link";

import { cn } from "@/app/lib/utils";

type MemberActionsProps = {
  className?: string;
};

export function MemberActions({ className }: MemberActionsProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2a2a2a] text-sm font-semibold text-white ring-1 ring-white/[0.08]"
          aria-hidden
        >
          V
        </div>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[13px] font-medium text-white">Member</p>
          <p className="truncate text-xs text-neutral-500">Free plan</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          href="#"
          className="flex h-9 flex-1 items-center justify-center rounded-xl border border-white/[0.14] bg-transparent text-sm font-medium text-white transition-colors hover:border-white/[0.2] hover:bg-white/[0.05]"
        >
          Log in
        </Link>
        <Link
          href="#"
          className="flex h-9 flex-1 items-center justify-center rounded-xl bg-[#E0E0E0] text-sm font-semibold text-[#171717] transition-colors hover:bg-neutral-200"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
