"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader } from "@/components/auth";
import { LicenseFormFields, type LicenseFormData } from "./_components/license-form-fields";
import { LicensePreview } from "./_components/license-preview";
import { ProfileFlowNotice } from "./_components/profile-flow-notice";
import { ProfileLoadingCard } from "./_components/profile-loading-card";
import { ProfileSubmitButton } from "./_components/profile-submit-button";

function formatBirthDate(formData: LicenseFormData) {
  const { birthDay, birthMonth, birthYear } = formData;

  if (!birthDay && !birthMonth && !birthYear) {
    return "";
  }

  const d = birthDay?.padStart(2, "0") || "__";
  const m = birthMonth?.padStart(2, "0") || "__";
  const y = birthYear || "____";

  return `${d}.${m}.${y}`;
}

export default function RejestracjaProfilPage() {
  const { isSignedIn, isLoaded: isAuthLoaded, signOut } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isAborting, setIsAborting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    trainingCategory?: string;
    birthDate?: string;
  }>({});

  const isLoading = !isAuthLoaded || !isUserLoaded;
  const hasPendingProfileFlow =
    typeof window !== "undefined" &&
    window.sessionStorage.getItem("registration_profile_pending") === "1";
  const shouldRedirect = !isLoading && (!isSignedIn || !user);

  useEffect(() => {
    if (!isLoading && isSignedIn && user) {
      window.sessionStorage.removeItem("registration_profile_pending");
    }
  }, [isLoading, isSignedIn, user]);

  useEffect(() => {
    if (shouldRedirect && !hasPendingProfileFlow) {
      router.replace("/rejestracja");
    }
  }, [shouldRedirect, hasPendingProfileFlow, router]);

  const initialValues = useMemo<LicenseFormData>(() => {
    const metadata = (user?.unsafeMetadata ?? {}) as Record<string, unknown>;
    const storedDate =
      typeof metadata.birthDate === "string" ? metadata.birthDate : "";
    const dateParts = storedDate.split("-");
    return {
      lastName: user?.lastName ?? "",
      firstName: user?.firstName ?? "",
      trainingCategory:
        metadata.trainingCategory === "A" ? "A" : "B",
      birthDay: dateParts.length === 3 ? dateParts[2] : "",
      birthMonth: dateParts.length === 3 ? dateParts[1] : "",
      birthYear: dateParts.length === 3 ? dateParts[0] : "",
    };
  }, [user]);

  const [formData, setFormData] = useState<LicenseFormData>(initialValues);

  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  if (isLoading) {
    return <ProfileLoadingCard />;
  }

  if (shouldRedirect && !hasPendingProfileFlow) return null;

  async function handleSubmit() {
    if (!user) return;

    const nextErrors: {
      firstName?: string;
      lastName?: string;
      trainingCategory?: string;
      birthDate?: string;
    } = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "Podaj imię.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Podaj nazwisko.";
    }

    if (formData.trainingCategory !== "B") {
      nextErrors.trainingCategory = "Obecnie prowadzimy zapisy tylko na kategorię B.";
    }

    const day = Number(formData.birthDay);
    const month = Number(formData.birthMonth);
    const year = Number(formData.birthYear);

    if (!formData.birthDay || !formData.birthMonth || !formData.birthYear) {
      nextErrors.birthDate = "Uzupełnij pełną datę urodzenia.";
    } else {
      const candidate = new Date(year, month - 1, day);
      const validDate =
        candidate.getFullYear() === year &&
        candidate.getMonth() === month - 1 &&
        candidate.getDate() === day;
      const age = new Date().getFullYear() - year;

      if (!validDate) {
        nextErrors.birthDate = "Podaj poprawną datę urodzenia.";
      } else if (age < 14 || age > 100) {
        nextErrors.birthDate = "Sprawdź rok urodzenia.";
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});

    setIsSaving(true);
    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          trainingCategory: formData.trainingCategory,
          birthDate: `${formData.birthYear}-${formData.birthMonth.padStart(2, "0")}-${formData.birthDay.padStart(2, "0")}`,
        },
      });

      router.push("/rejestracja/dokument");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAbortRegistration() {
    if (!user || isAborting) return;

    const confirmed = window.confirm(
      "To usunie konto i wszystkie dotychczasowe dane rejestracji. Tej operacji nie da sie cofnac. Czy kontynuowac?",
    );

    if (!confirmed) return;

    setIsAborting(true);

    try {
      const response = await fetch("/api/registration/abort", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("ABORT_FAILED");
      }

      window.sessionStorage.removeItem("registration_profile_pending");
      await signOut({ redirectUrl: "/rejestracja" });
      window.location.assign("/rejestracja");
    } catch {
      setFieldErrors({
        birthDate: "Nie udało się usunąć konta. Spróbuj ponownie za chwilę.",
      });
      setIsAborting(false);
    }
  }

  return (
    <AuthCard className="lg:max-w-3xl">
      <AuthCardHeader
        title="Uzupełnij swoje przyszłe prawo jazdy"
        description="Wpisz dane w formularz poniżej — zobaczysz je natychmiast na podglądzie dokumentu."
      />

      <form action={handleSubmit} noValidate className="space-y-6">
        <LicenseFormFields
          formData={formData}
          setFormData={setFormData}
          errors={fieldErrors}
        />

        <LicensePreview
          formData={formData}
          formattedBirthDate={formatBirthDate(formData)}
        />

        <ProfileFlowNotice />

        <ProfileSubmitButton
          disabled={isSaving || isLoading}
          isSaving={isSaving}
          isAborting={isAborting}
          onAbort={() => void handleAbortRegistration()}
        />
      </form>
    </AuthCard>
  );
}
