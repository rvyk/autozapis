"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader } from "@/components/auth";
import { mapRegistrationClerkError } from "../../_components/auth-error-utils";
import { RegistrationFooter } from "./registration-footer";
import { RegistrationForm } from "./registration-form";

export function RejestracjaPageContent() {
  const { signUp } = useSignUp();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<{
    globalError?: string;
    emailError?: string;
    phoneError?: string;
    passwordError?: string;
  }>({});

  async function handleSubmit(formData: FormData) {
    const emailAddress = (formData.get("email") as string | null)?.trim() ?? "";
    const phone = (formData.get("phone") as string | null)?.trim() ?? "";
    const password = (formData.get("password") as string | null) ?? "";

    const normalizedPhone = phone.replace(/\s+/g, "");

    const nextErrors: {
      globalError?: string;
      emailError?: string;
      phoneError?: string;
      passwordError?: string;
    } = {};

    if (!emailAddress) {
      nextErrors.emailError = "Podaj adres e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      nextErrors.emailError = "Podaj poprawny adres e-mail.";
    }

    if (!normalizedPhone) {
      nextErrors.phoneError = "Podaj numer telefonu.";
    } else if (!/^\+?[0-9]{9,15}$/.test(normalizedPhone)) {
      nextErrors.phoneError = "Podaj poprawny numer telefonu (9-15 cyfr).";
    }

    if (!password) {
      nextErrors.passwordError = "Podaj hasło.";
    } else if (password.length < 8) {
      nextErrors.passwordError = "Hasło musi mieć co najmniej 8 znaków.";
    }

    if (
      nextErrors.emailError ||
      nextErrors.phoneError ||
      nextErrors.passwordError
    ) {
      setSubmitErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitErrors({});

    let result: Awaited<ReturnType<typeof signUp.password>>;

    try {
      result = await signUp.password({
        emailAddress,
        password,
        unsafeMetadata: {
          phoneNumber: normalizedPhone,
        },
      });
    } catch {
      setSubmitErrors({
        globalError: "Nie udało się utworzyć konta. Spróbuj ponownie.",
      });
      setIsSubmitting(false);
      return;
    }

    if (result.error) {
      setSubmitErrors(mapRegistrationClerkError(result.error));
      setIsSubmitting(false);
      return;
    }

    await signUp.verifications.sendEmailCode();
    setIsSubmitting(false);
    router.push("/rejestracja/weryfikacja");
  }

  return (
    <AuthCard>
      <AuthCardHeader
        title="Utwórz konto"
        description="Podaj email, numer telefonu i hasło, aby rozpocząć zapis na kurs prawa jazdy w Leżajsku."
      />

      <RegistrationForm
        onSubmit={handleSubmit}
        globalError={submitErrors.globalError}
        emailError={submitErrors.emailError}
        phoneError={submitErrors.phoneError}
        passwordError={submitErrors.passwordError}
        isLoading={isSubmitting}
      />

      <RegistrationFooter />

      <div id="clerk-captcha" />
    </AuthCard>
  );
}
