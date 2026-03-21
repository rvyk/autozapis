"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type RegistrationFormProps = {
  onSubmit: (formData: FormData) => Promise<void>;
  globalError?: string;
  emailError?: string;
  phoneError?: string;
  passwordError?: string;
  isLoading: boolean;
};

export function RegistrationForm({
  onSubmit,
  globalError,
  emailError,
  phoneError,
  passwordError,
  isLoading,
}: RegistrationFormProps) {
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
        {emailError && (
          <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
        )}
      </Field>

      <Field className="space-y-2">
        <FieldLabel>Numer telefonu</FieldLabel>
        <Input
          name="phone"
          type="tel"
          placeholder="600123456"
          autoComplete="tel"
        />
        {phoneError && (
          <p className="text-sm text-red-600 dark:text-red-400">{phoneError}</p>
        )}
      </Field>

      <Field className="space-y-2">
        <FieldLabel>Hasło</FieldLabel>
        <Input name="password" type="password" autoComplete="new-password" />
        {passwordError && (
          <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
        )}
      </Field>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Tworzenie konta..." : "Przejdź dalej"}
      </Button>
    </form>
  );
}
