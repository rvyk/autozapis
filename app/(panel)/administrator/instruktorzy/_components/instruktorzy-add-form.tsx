"use client";

import { Button } from "@/components/ui/button";

export function InstruktorzyAddForm({
  email,
  pending,
  disabled,
  onEmailChange,
  onSubmit,
}: {
  email: string;
  pending: boolean;
  disabled: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
      <div className="flex-1">
        <label
          htmlFor="new-instructor-email"
          className="mb-1 block text-xs font-semibold uppercase tracking-wide text-stone-500"
        >
          Dodaj instruktora po e-mailu
        </label>
        <input
          id="new-instructor-email"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="np. instruktor@osk.pl"
          className="h-10 w-full rounded-xl border border-stone-300 px-3 text-sm text-stone-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
        />
      </div>
      <Button onClick={onSubmit} disabled={pending || disabled} className="sm:min-w-40">
        {pending ? "Dodawanie..." : "Dodaj instruktora"}
      </Button>
    </div>
  );
}
