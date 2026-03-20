"use client";

import { useEffect } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader, VerificationForm } from "@/components/auth";
import { useAuthNavigation } from "@/hooks";

export default function LogowanieWeryfikacjaPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const { navigate } = useAuthNavigation();

  const shouldRedirect = signIn.status !== "needs_client_trust";

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
    <AuthCard>
      <AuthCardHeader
        title="Zweryfikuj swoje konto"
        description="Wprowadź kod weryfikacyjny wysłany na Twój adres email."
      />

      <VerificationForm
        onSubmit={handleVerify}
        onResend={handleResend}
        error={errors.fields.code?.message}
        isLoading={fetchStatus === "fetching"}
      />

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            signIn.reset();
            router.push("/logowanie");
          }}
          className="text-sm font-medium text-red-700 transition-colors hover:text-red-900"
        >
          Zacznij od nowa
        </button>
      </div>
    </AuthCard>
  );
}
