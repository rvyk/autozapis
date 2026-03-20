"use client";

import * as React from "react";
import { Input as BaseInput } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof BaseInput>
>(({ className, ...props }, ref) => (
  <BaseInput
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-xl border border-stone-300 bg-background px-3 py-2 text-sm text-foreground",
      "placeholder:text-stone-400",
      "focus:outline-none focus:ring-2 focus:ring-red-500/25 focus:border-red-500",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "transition-colors duration-150",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
