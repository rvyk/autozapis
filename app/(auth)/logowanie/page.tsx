"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader } from "@/components/auth";
import { useAuthNavigation } from "@/hooks";
import { LoginFooter } from "./_components/login-footer";
import { LoginForm } from "./_components/login-form";

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

      <LoginForm
        onSubmit={handleSubmit}
        identifierError={errors.fields.identifier?.message}
        passwordError={errors.fields.password?.message}
        isLoading={fetchStatus === "fetching"}
      />

      <LoginFooter />
    </AuthCard>
  );
}
