"use client";

import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { AuthCard, AuthCardHeader, AuthCardFooter } from "@/components/auth";
import { useAuthNavigation } from "@/hooks";

export default function LogowaniePage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const { navigate } = useAuthNavigation();

  async function handleSubmit(formData: FormData) {
    const emailAddress = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigate("/") });
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
        router.push("/logowanie/weryfikacja");
      }
    }
  }

  return (
    <AuthCard>
      <AuthCardHeader
        title="Witaj ponownie"
        description="Zaloguj się do swojego konta kursanta, aby kontynuować proces zapisu."
      />

      <form action={handleSubmit} className="space-y-4">
        <Field className="space-y-2">
          <FieldLabel>Email</FieldLabel>
          <Input
            name="email"
            type="email"
            placeholder="jan@example.com"
            autoComplete="email"
          />
          {errors.fields.identifier && (
            <FieldError>{errors.fields.identifier.message}</FieldError>
          )}
        </Field>

        <Field className="space-y-2">
          <FieldLabel>Hasło</FieldLabel>
          <Input
            name="password"
            type="password"
            autoComplete="current-password"
          />
          {errors.fields.password && (
            <FieldError>{errors.fields.password.message}</FieldError>
          )}
        </Field>

        <Button
          type="submit"
          className="w-full"
          disabled={fetchStatus === "fetching"}
        >
          {fetchStatus === "fetching" ? "Logowanie..." : "Zaloguj się"}
        </Button>
      </form>

      <AuthCardFooter>
        Nie masz konta?{" "}
        <Link
          href="/rejestracja"
          className="font-semibold text-red-700 underline-offset-4 transition-colors hover:text-red-800 hover:underline"
        >
          Zarejestruj się
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
