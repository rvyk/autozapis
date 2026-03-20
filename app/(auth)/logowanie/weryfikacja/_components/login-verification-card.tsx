import { AuthCard, AuthCardHeader, VerificationForm } from "@/components/auth";
import { RestartLoginButton } from "../../_components/restart-login-button";

type LoginVerificationCardProps = {
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onRestart: () => void;
  error?: string;
  isLoading: boolean;
};

export function LoginVerificationCard({
  onVerify,
  onResend,
  onRestart,
  error,
  isLoading,
}: LoginVerificationCardProps) {
  return (
    <AuthCard>
      <AuthCardHeader
        title="Zweryfikuj swoje konto"
        description="Wprowadź kod weryfikacyjny wysłany na Twój adres email."
      />

      <VerificationForm
        onSubmit={onVerify}
        onResend={onResend}
        error={error}
        isLoading={isLoading}
      />

      <RestartLoginButton onRestart={onRestart} />
    </AuthCard>
  );
}
