import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-web3-cyan/20 p-6",
        "bg-web3-navy/60 backdrop-blur-glass",
        "shadow-[0_0_10px_rgba(0,255,255,0.15)]",
        hover && "transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:border-web3-cyan/40",
        className
      )}
    >
      {children}
    </div>
  );
}
