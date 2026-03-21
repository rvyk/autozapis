"use client";

import { useEffect } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAuthNavigation } from "@/hooks";
import { LoginVerificationCard } from "./_components/login-verification-card";

export default function LogowanieWeryfikacjaPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const { navigate } = useAuthNavigation();

  const shouldRedirect =
    signIn.status !== "needs_client_trust" &&
    signIn.status !== "needs_second_factor";

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/logowanie");
    }
  }, [shouldRedirect, router]);

  async function handleVerify(code: string) {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigate("/") });
    }
  }

  async function handleResend() {
    await signIn.mfa.sendEmailCode();
  }

  if (shouldRedirect) {
    return null;
  }

  return (
    <LoginVerificationCard
      onVerify={handleVerify}
      onResend={handleResend}
      error={errors.fields.code?.message}
      isLoading={fetchStatus === "fetching"}
      onRestart={() => {
        signIn.reset();
        router.push("/logowanie");
      }}
    />
  );
}
