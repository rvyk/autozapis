"use client";

import { Button } from "@/components/ui/button";

export function InstruktorJazdyHeaderActions({
  onPrevious,
  onNext,
}: {
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
      <Button variant="ghost" size="sm" onClick={onPrevious} className="w-full sm:w-auto">
        Poprzedni
      </Button>
      <Button variant="ghost" size="sm" onClick={onNext} className="w-full sm:w-auto">
        Nastepny
      </Button>
    </div>
  );
}
