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
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={onPrevious}>
        Poprzedni
      </Button>
      <Button variant="ghost" size="sm" onClick={onNext}>
        Nastepny
      </Button>
    </div>
  );
}
