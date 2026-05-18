"use client";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "cyan" | "purple" | "magenta";
}

export function NeonButton({
  variant = "cyan",
  className,
  children,
  ...rest
}: NeonButtonProps) {
  const variants = {
    cyan: "border-neon-cyan/40 bg-neon-cyan/5 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan hover:shadow-[0_0_20px_#00fff0aa,0_0_40px_#00fff033]",
    purple:
      "border-neon-purple/40 bg-neon-purple/5 text-neon-purple hover:bg-neon-purple/10 hover:border-neon-purple hover:shadow-[0_0_20px_#b266ffaa,0_0_40px_#b266ff33]",
    magenta:
      "border-neon-magenta/40 bg-neon-magenta/5 text-neon-magenta hover:bg-neon-magenta/10 hover:border-neon-magenta hover:shadow-[0_0_20px_#ff3df0aa,0_0_40px_#ff3df033]",
  }[variant];

  return (
    <button
      className={cn(
        "group relative px-6 py-3 rounded-xl border font-ui font-semibold tracking-wide uppercase text-sm",
        "transition-all duration-300 active:scale-[0.98]",
        variants,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
