"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "destructive"
    | "destructiveOutline";
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
            "bg-linear-to-b from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500":
              variant === "primary",
            "border border-stone-300 bg-white text-stone-700 shadow-sm hover:bg-stone-100 focus:ring-red-500":
              variant === "secondary",
            "border border-red-200 bg-red-50 text-red-700 shadow-sm hover:bg-red-100 focus:ring-red-500":
              variant === "outline",
            "text-stone-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-500":
              variant === "ghost",
            "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500":
              variant === "destructive",
            "border border-red-200 bg-white text-red-700 shadow-sm hover:bg-red-50 focus:ring-red-500":
              variant === "destructiveOutline",
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
