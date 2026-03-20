"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthCard, AuthCardHeader } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

type LicenseFormData = {
  lastName: string;
  firstName: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
};

export default function RejestracjaProfilPage() {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

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

  if (shouldRedirect && !hasPendingProfileFlow) return null;

  async function handleSubmit() {
    if (!user) return;

    setIsSaving(true);
    try {
      await user.update({
        firstName: formData.firstName,
        lastName: formData.lastName,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          birthDate: `${formData.birthYear}-${formData.birthMonth.padStart(2, "0")}-${formData.birthDay.padStart(2, "0")}`,
        },
      });

      router.push("/rejestracja/dokument");
    } finally {
      setIsSaving(false);
    }
  }

  const formatBirthDate = () => {
    const { birthDay, birthMonth, birthYear } = formData as LicenseFormData & {
      birthDay: string;
      birthMonth: string;
      birthYear: string;
    };
    if (!birthDay && !birthMonth && !birthYear) return "";
    const d = birthDay?.padStart(2, "0") || "__";
    const m = birthMonth?.padStart(2, "0") || "__";
    const y = birthYear || "____";
    return `${d}.${m}.${y}`;
  };

  return (
    <AuthCard className="lg:max-w-3xl">
      <AuthCardHeader
        title="Uzupełnij swoje przyszłe prawo jazdy"
        description="Wpisz dane w formularz poniżej — zobaczysz je natychmiast na podglądzie dokumentu."
      />

      <form action={handleSubmit} className="space-y-6">
        {/* ── Form fields ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field className="space-y-2">
            <FieldLabel>Nazwisko</FieldLabel>
            <Input
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  lastName: e.target.value,
                }))
              }
              placeholder="Kowalski"
              autoComplete="family-name"
              required
            />
          </Field>

          <Field className="space-y-2">
            <FieldLabel>Imię</FieldLabel>
            <Input
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  firstName: e.target.value,
                }))
              }
              placeholder="Jan"
              autoComplete="given-name"
              required
            />
          </Field>

          <Field className="space-y-2 sm:col-span-3">
            <FieldLabel>Data urodzenia</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={formData.birthDay}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, birthDay: e.target.value }))
                }
                required
                className="flex h-10 w-full appearance-none rounded-xl border border-stone-300 bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  Dzień
                </option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={String(d).padStart(2, "0")}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={formData.birthMonth}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthMonth: e.target.value,
                  }))
                }
                required
                className="flex h-10 w-full appearance-none rounded-xl border border-stone-300 bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  Miesiąc
                </option>
                {[
                  "Styczeń",
                  "Luty",
                  "Marzec",
                  "Kwiecień",
                  "Maj",
                  "Czerwiec",
                  "Lipiec",
                  "Sierpień",
                  "Wrzesień",
                  "Październik",
                  "Listopad",
                  "Grudzień",
                ].map((name, i) => (
                  <option key={i} value={String(i + 1).padStart(2, "0")}>
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={formData.birthYear}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    birthYear: e.target.value,
                  }))
                }
                required
                className="flex h-10 w-full appearance-none rounded-xl border border-stone-300 bg-background px-3 py-2 text-sm text-foreground transition-colors duration-150 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  Rok
                </option>
                {Array.from(
                  { length: 71 },
                  (_, i) => new Date().getFullYear() - 17 - i,
                ).map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </Field>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-stone-400">
            Podgląd na żywo
          </p>
          <div className="animate-license-glow overflow-hidden rounded-2xl border border-red-200/60 bg-white p-1.5 sm:p-2.5">
            <div className="relative aspect-1303/819 w-full overflow-hidden rounded-xl">
              <Image
                src="/prawojazdy.jpg"
                alt="Podgląd prawa jazdy"
                fill
                sizes="(max-width: 1024px) 100vw, 920px"
                className="object-cover"
                priority
              />

              <span
                className="absolute left-[36%] top-[20.5%] w-[28%] truncate text-[clamp(9px,1.2vw,14px)] font-bold uppercase tracking-wide text-stone-900 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]"
                aria-hidden
              >
                {formData.lastName || (
                  <span className="text-stone-400/50 font-normal normal-case italic">
                    Nazwisko
                  </span>
                )}
              </span>

              <span
                className="absolute left-[36%] top-[27%] w-[28%] truncate text-[clamp(9px,1.2vw,14px)] font-bold uppercase tracking-wide text-stone-900 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]"
                aria-hidden
              >
                {formData.firstName || (
                  <span className="text-stone-400/50 font-normal normal-case italic">
                    Imię
                  </span>
                )}
              </span>

              <span
                className="absolute left-[36%] top-[33.5%] w-[28%] truncate text-[clamp(9px,1.2vw,14px)] font-semibold tabular-nums text-stone-900 drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]"
                aria-hidden
              >
                {formData.birthDay ||
                formData.birthMonth ||
                formData.birthYear ? (
                  formatBirthDate()
                ) : (
                  <span className="text-stone-400/50 font-normal italic">
                    DD.MM.RRRR
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50/50 px-4 py-3">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-pretty text-sm leading-relaxed text-red-900/70">
            Podgląd aktualizuje się na bieżąco. Upewnij się, że dane są poprawne
            przed kontynuowaniem.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSaving || isLoading}
        >
          {isSaving ? "Zapisywanie..." : "Przejdź do wysłania PKK"}
        </Button>
      </form>
    </AuthCard>
  );
}
