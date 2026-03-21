"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LoginFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  globalError?: string;
  identifierError?: string;
  passwordError?: string;
  isLoading: boolean;
};

export function LoginForm({
  onSubmit,
  globalError,
  identifierError,
  passwordError,
  isLoading,
}: LoginFormProps) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await onSubmit(formData);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {globalError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {globalError}
        </div>
      )}

      <Field className="space-y-2">
        <FieldLabel>Email</FieldLabel>
        <Input
          name="email"
          type="email"
          placeholder="jan@example.com"
          autoComplete="email"
        />
        {identifierError && (
          <p className="text-sm text-red-600 dark:text-red-400">{identifierError}</p>
        )}
      </Field>

      <Field className="space-y-2">
        <FieldLabel>Hasło</FieldLabel>
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
        />
        {passwordError && (
          <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
        )}
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logowanie..." : "Zaloguj się"}
      </Button>
    </form>
  );
}
