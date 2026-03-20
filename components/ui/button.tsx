"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      disabled,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-150",
          "focus:outline-none focus:ring-2 focus:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-linear-to-b from-red-600 to-red-700 text-white shadow-[0_1px_3px_rgba(220,38,38,0.4),inset_0_1px_0_rgba(255,255,255,0.1)] hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(220,38,38,0.35)] active:translate-y-0 focus:ring-red-500":
              variant === "primary",
            "border border-red-200 bg-transparent text-stone-700 hover:bg-red-50 hover:text-red-700 focus:ring-red-500":
              variant === "secondary",
            "text-stone-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-500":
              variant === "ghost",
          },
          {
            "h-8 px-3 text-sm": size === "sm",
            "h-10 px-4 text-sm": size === "md",
            "h-12 px-6 text-base": size === "lg",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
