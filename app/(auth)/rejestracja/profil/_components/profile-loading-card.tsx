import { AuthCard, AuthCardHeader } from "@/components/auth";

export function ProfileLoadingCard() {
  return (
    <AuthCard>
      <AuthCardHeader
        title="Ładowanie..."
        description="Przygotowywanie formularza"
      />
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
      </div>
    </AuthCard>
  );
}
