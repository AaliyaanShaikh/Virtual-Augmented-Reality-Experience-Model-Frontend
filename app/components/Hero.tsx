import { Star } from "lucide-react";

import { cn } from "@/app/lib/utils";

type HeroProps = {
  className?: string;
};

export function Hero({ className }: HeroProps) {
  return (
    <div className={cn("w-full max-w-[672px] text-center", className)}>
      <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-neutral-600">
        Image to 3D
      </p>
      <h1 className="flex flex-wrap items-center justify-center gap-2.5 text-3xl font-semibold tracking-tight text-neutral-100 sm:text-4xl">
        <Star
          className="size-6 shrink-0 fill-[#e8a87c] text-[#e8a87c] sm:size-7"
          strokeWidth={1.5}
          aria-hidden
        />
        <span>Create 3D Models from Images</span>
      </h1>
      <p className="mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-neutral-500 sm:mx-auto">
        Upload images and generate immersive AR/VR models instantly
      </p>
    </div>
  );
}
