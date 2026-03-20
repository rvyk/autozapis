"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader } from "@/components/auth";
import { RegistrationFooter } from "./registration-footer";
import { RegistrationForm } from "./registration-form";
import { RegistrationIntro } from "./registration-intro";

export function RejestracjaPageContent() {
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

      <RegistrationIntro />

      <RegistrationForm
        onSubmit={handleSubmit}
        emailError={errors.fields.emailAddress?.message}
        passwordError={errors.fields.password?.message}
        isLoading={fetchStatus === "fetching"}
      />

      <RegistrationFooter />

      <div id="clerk-captcha" />
    </AuthCard>
  );
}
