"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <section
      className={cn(
        "animate-fade-up space-y-6 rounded-3xl border border-red-100/80 bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(220,38,38,0.14)] backdrop-blur-sm sm:p-8",
        className,
      )}
    >
      {children}
    </section>
  );
}

interface AuthCardHeaderProps {
  title: string;
  description?: string;
}

export function AuthCardHeader({ title, description }: AuthCardHeaderProps) {
  return (
    <div className="space-y-2 text-center sm:text-left">
      <p className="inline-flex w-fit items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-red-700">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
        OSK Leżajsk
      </p>
      <h1 className="text-balance text-2xl font-bold text-stone-900">
        {title}
      </h1>
      {description && (
        <p className="text-pretty text-sm leading-relaxed text-stone-500">
          {description}
        </p>
      )}
    </div>
  );
}

interface AuthCardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCardFooter({ children, className }: AuthCardFooterProps) {
  return (
    <p
      className={cn(
        "text-center text-sm text-stone-500 sm:text-left",
        "border-t border-stone-200 pt-4",
        className,
      )}
    >
      {children}
    </p>
  );
}
