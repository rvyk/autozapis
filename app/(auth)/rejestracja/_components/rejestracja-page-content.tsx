"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader } from "@/components/auth";
import { RegistrationFooter } from "./registration-footer";
import { RegistrationForm } from "./registration-form";
import { RegistrationIntro } from "./registration-intro";

export function RejestracjaPageContent() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [phoneError, setPhoneError] = useState<string | undefined>(undefined);

  async function handleSubmit(formData: FormData) {
    const emailAddress = formData.get("email") as string;
    const phone = (formData.get("phone") as string | null)?.trim() ?? "";
    const password = formData.get("password") as string;

    const normalizedPhone = phone.replace(/\s+/g, "");

    setPhoneError(undefined);

    if (!/^\+?[0-9]{9,15}$/.test(normalizedPhone)) {
      setPhoneError("Podaj poprawny numer telefonu (9-15 cyfr).");
      return;
    }

    const result = await signUp.password({
      emailAddress,
      password,
      unsafeMetadata: {
        phoneNumber: normalizedPhone,
      },
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
        phoneError={phoneError}
        passwordError={errors.fields.password?.message}
        isLoading={fetchStatus === "fetching"}
      />

      <RegistrationFooter />

      <div id="clerk-captcha" />
    </AuthCard>
  );
}
