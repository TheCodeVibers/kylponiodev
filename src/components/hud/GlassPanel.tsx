import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  glow?: "cyan" | "purple" | "magenta" | "none";
}

export function GlassPanel({
  glow = "cyan",
  className,
  children,
  ...rest
}: GlassPanelProps) {
  const glowClass = {
    cyan: "shadow-[0_0_60px_rgba(0,255,240,0.08)]",
    purple: "shadow-[0_0_60px_rgba(178,102,255,0.08)]",
    magenta: "shadow-[0_0_60px_rgba(255,61,240,0.08)]",
    none: "",
  }[glow];

  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.04]",
        "backdrop-blur-xl backdrop-saturate-150",
        glowClass,
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
