"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader } from "@/components/auth";
import { DocumentPrivacyFooter } from "./_components/document-privacy-footer";
import { DocumentSubmitButton } from "./_components/document-submit-button";
import { DocumentUploadField } from "./_components/document-upload-field";

const MAX_SIZE_MB = 10;

export default function RejestracjaDokumentPage() {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const isLoading = !isAuthLoaded || !isUserLoaded;
  const shouldRedirect = !isLoading && (!isSignedIn || !user);

  useEffect(() => {
    if (shouldRedirect) {
      router.replace("/rejestracja");
    }
  }, [shouldRedirect, router]);

  if (shouldRedirect) {
    return null;
  }

  async function handleSubmit(formData: FormData) {
    setError(null);
    setIsUploading(true);

    try {
      const file = formData.get("file");
      if (!(file instanceof File) || file.size === 0) {
        setError("Wybierz plik PDF, JPG, PNG lub WEBP.");
        return;
      }

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Plik jest za duży. Maksymalny rozmiar to ${MAX_SIZE_MB} MB.`);
        return;
      }

      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetch("/api/pkk/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;

        if (payload?.error === "UNSUPPORTED_FILE_TYPE") {
          setError("Obsługiwane formaty: PDF, JPG, PNG, WEBP.");
          return;
        }

        if (payload?.error === "USER_NOT_SYNCED") {
          setError(
            "Konto nie jest jeszcze zsynchronizowane. Spróbuj ponownie za chwilę.",
          );
          return;
        }

        setError("Nie udało się wysłać dokumentu. Spróbuj ponownie.");
        return;
      }

      router.push("/");
    } catch {
      setError("Nie udało się wysłać dokumentu. Spróbuj ponownie.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <AuthCard>
      <AuthCardHeader
        title="Wyślij dokument PKK"
        description="Dodaj zdjęcie lub plik PKK. Dokument trafi do właściciela ośrodka do akceptacji."
      />

      <form action={handleSubmit} className="space-y-4">
        <DocumentUploadField
          maxSizeMb={MAX_SIZE_MB}
          fileName={fileName}
          error={error}
          onFileChange={setFileName}
        />

        <DocumentSubmitButton isLoading={isUploading || isLoading} />
      </form>

      <DocumentPrivacyFooter />
    </AuthCard>
  );
}
