"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader } from "@/components/auth";
import { useAuthNavigation } from "@/hooks";
import { mapLoginClerkError } from "../../_components/auth-error-utils";
import { LoginFooter } from "./login-footer";
import { LoginForm } from "./login-form";

export function LogowaniePageContent() {
  const { signIn } = useSignIn();
  const router = useRouter();
  const { navigate } = useAuthNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<{
    globalError?: string;
    identifierError?: string;
    passwordError?: string;
  }>({});

  async function handleSubmit(formData: FormData) {
    const emailAddress = (formData.get("email") as string | null)?.trim() ?? "";
    const password = (formData.get("password") as string | null) ?? "";

    const nextErrors: {
      globalError?: string;
      identifierError?: string;
      passwordError?: string;
    } = {};

    if (!emailAddress) {
      nextErrors.identifierError = "Podaj adres e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
      nextErrors.identifierError = "Podaj poprawny adres e-mail.";
    }

    if (!password) {
      nextErrors.passwordError = "Podaj hasło.";
    }

    if (nextErrors.identifierError || nextErrors.passwordError) {
      setSubmitErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitErrors({});

    let error: unknown;
    let status: string | undefined;

    try {
      const result = await signIn.password({
        emailAddress,
        password,
      });
      error = result.error;
      status = signIn.status;
    } catch {
      setSubmitErrors({
        globalError: "Nie udało się zalogować. Spróbuj ponownie.",
      });
      setIsSubmitting(false);
      return;
    }

    if (error) {
      setSubmitErrors(mapLoginClerkError(error));
      setIsSubmitting(false);
      return;
    }

    if (status === "complete") {
      await signIn.finalize({ navigate: navigate("/") });
      setIsSubmitting(false);
    } else if (status === "needs_client_trust" || status === "needs_second_factor") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
        router.push("/logowanie/weryfikacja");
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard>
      <AuthCardHeader
        title="Witaj ponownie"
        description="Zaloguj się do swojego konta kursanta, aby kontynuować proces zapisu."
      />

      <LoginForm
        onSubmit={handleSubmit}
        globalError={submitErrors.globalError}
        identifierError={submitErrors.identifierError}
        passwordError={submitErrors.passwordError}
        isLoading={isSubmitting}
      />

      <LoginFooter />
    </AuthCard>
  );
}
