"use client";

import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader, VerificationForm } from "@/components/auth";

export default function RejestracjaWeryfikacjaPage() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);

  const isInProgress =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address");

  useEffect(() => {
    if (!isInProgress && !isVerifying && signUp.status !== "complete") {
      router.replace("/rejestracja");
    }
  }, [isInProgress, isVerifying, signUp.status, router]);

  async function handleVerify(code: string) {
    setIsVerifying(true);

    const result = await signUp.verifications.verifyEmailCode({ code });

    if (result.error) {
      setIsVerifying(false);
      return;
    }

    if (signUp.status === "complete") {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("registration_profile_pending", "1");
      }

      router.push("/rejestracja/profil");

      signUp.finalize().catch(console.error);
    } else {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    await signUp.verifications.sendEmailCode();
  }

  if (!isInProgress && !isVerifying) {
    return null;
  }

  return (
    <AuthCard>
      <AuthCardHeader
        title="Potwierdź email"
        description="Wpisz kod z wiadomości email, aby kontynuować do uzupełniania prawa jazdy."
      />

      <VerificationForm
        onSubmit={handleVerify}
        onResend={handleResend}
        error={errors.fields.code?.message}
        isLoading={fetchStatus === "fetching" || isVerifying}
      />
    </AuthCard>
  );
}
