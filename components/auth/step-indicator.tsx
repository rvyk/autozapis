"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface Step {
  key: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          Krok {currentStepIndex + 1} z {steps.length}
        </span>
        <span className="font-medium text-stone-700">
          {steps[currentStepIndex]?.label}
        </span>
      </div>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all duration-300",
                index < currentStepIndex &&
                  "bg-red-600 text-white shadow-[0_2px_8px_rgba(220,38,38,0.3)]",
                index === currentStepIndex &&
                  "bg-red-600 text-white ring-4 ring-red-100 shadow-[0_2px_8px_rgba(220,38,38,0.3)]",
                index > currentStepIndex && "bg-stone-200 text-stone-400",
              )}
            >
              {index < currentStepIndex ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 transition-colors duration-300",
                  index < currentStepIndex ? "bg-red-600" : "bg-stone-200",
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
