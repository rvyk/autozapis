"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface VerificationFormProps {
  onSubmit: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  error?: string;
  isLoading?: boolean;
  submitLabel?: string;
  loadingLabel?: string;
}

export function VerificationForm({
  onSubmit,
  onResend,
  error,
  isLoading = false,
  submitLabel = "Zweryfikuj",
  loadingLabel = "Weryfikacja...",
}: VerificationFormProps) {
  async function handleSubmit(formData: FormData) {
    const code = formData.get("code") as string;
    await onSubmit(code);
  }

  return (
    <div className="space-y-4">
      <form action={handleSubmit} className="space-y-4">
        <Field className="space-y-2">
          <FieldLabel>Kod weryfikacyjny</FieldLabel>
          <Input
            name="code"
            type="text"
            placeholder="123456"
            autoComplete="one-time-code"
            className="tabular-nums tracking-[0.3em] text-center text-lg font-semibold"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
          />
          {error && <FieldError>{error}</FieldError>}
        </Field>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? loadingLabel : submitLabel}
        </Button>
      </form>

      <div className="rounded-xl border border-red-100 bg-red-50/50 p-3 text-center">
        <button
          type="button"
          onClick={onResend}
          className="text-sm font-medium text-red-700 transition-colors hover:text-red-900"
        >
          Wyślij nowy kod
        </button>
      </div>
    </div>
  );
}
