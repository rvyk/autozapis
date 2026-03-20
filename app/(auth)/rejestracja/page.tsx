"use client";

import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { AuthCard, AuthCardHeader, AuthCardFooter } from "@/components/auth";

export default function RejestracjaPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const emailAddress = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signUp.password({
      emailAddress,
      password,
    });

    if (result.error) {
      return;
    }

    await signUp.verifications.sendEmailCode();
    router.push("/rejestracja/weryfikacja");
  }

  return (
    <AuthCard>
      <AuthCardHeader
        title="Utwórz konto"
        description="Podaj email i hasło, aby rozpocząć zapis na kurs prawa jazdy w Leżajsku."
      />

      <div className="rounded-xl border border-red-100 bg-linear-to-br from-red-50/80 to-rose-50/60 p-4">
        <p className="text-pretty text-sm leading-relaxed text-red-900/80">
          Po rejestracji uzupełnisz dane bezpośrednio na makiecie prawa jazdy i
          prześlesz PKK do akceptacji właściciela ośrodka.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <Field className="space-y-2">
          <FieldLabel>Email</FieldLabel>
          <Input
            name="email"
            type="email"
            placeholder="jan@example.com"
            autoComplete="email"
          />
          {errors.fields.emailAddress && (
            <FieldError>{errors.fields.emailAddress.message}</FieldError>
          )}
        </Field>

        <Field className="space-y-2">
          <FieldLabel>Hasło</FieldLabel>
          <Input name="password" type="password" autoComplete="new-password" />
          {errors.fields.password && (
            <FieldError>{errors.fields.password.message}</FieldError>
          )}
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={fetchStatus === "fetching"}
        >
          {fetchStatus === "fetching" ? "Tworzenie konta..." : "Przejdź dalej"}
        </Button>
      </form>

      <AuthCardFooter>
        Masz już konto?{" "}
        <Link
          href="/logowanie"
          className="font-semibold text-red-700 underline-offset-4 transition-colors hover:text-red-800 hover:underline"
        >
          Zaloguj się
        </Link>
      </AuthCardFooter>

      <div id="clerk-captcha" />
    </AuthCard>
  );
}
