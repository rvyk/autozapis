import { AuthCard, AuthCardHeader, VerificationForm } from "@/components/auth";

type RegistrationVerificationCardProps = {
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  error?: string;
  isLoading: boolean;
};

export function RegistrationVerificationCard({
  onVerify,
  onResend,
  error,
  isLoading,
}: RegistrationVerificationCardProps) {
  return (
    <AuthCard>
      <AuthCardHeader
        title="Potwierdź email"
        description="Wpisz kod z wiadomości email, aby kontynuować do uzupełniania prawa jazdy."
      />

      <VerificationForm
        onSubmit={onVerify}
        onResend={onResend}
        error={error}
        isLoading={isLoading}
      />
    </AuthCard>
  );
}
