import type { ReactNode } from "react";
import { useScrollReveal } from "@/shared/hooks/useScrollReveal";

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
};

export function FadeIn({ children, delay = 0, className = "" }: FadeInProps) {
  const { ref, visible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`${visible ? "animate-hero-in" : "opacity-0"} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
