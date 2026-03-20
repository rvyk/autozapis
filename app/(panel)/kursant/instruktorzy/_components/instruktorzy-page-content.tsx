"use client";

import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { Button } from "@/components/ui/button";

type AssignedInstructor = {
  id: string;
  fullName: string;
  phoneNumber: string | null;
  assignedAt: string;
};

type OtherInstructor = {
  id: string;
  fullName: string;
  phoneNumber: string | null;
};

function initialsFromName(fullName: string) {
  const parts = fullName.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "IN";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatAssignedAt(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function phoneHref(phoneNumber: string) {
  return `tel:${phoneNumber.replace(/\s+/g, "")}`;
}

export function InstruktorzyPageContent({
  assignedInstructor,
  otherInstructors,
}: {
  assignedInstructor: AssignedInstructor | null;
  otherInstructors: OtherInstructor[];
}) {
  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Instruktorzy"
        description="Sprawdź swojego instruktora prowadzącego oraz dostępnych instruktorów w ośrodku."
      />

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          Instruktor prowadzący
        </p>

        {!assignedInstructor ? (
          <div className="mt-3 rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-5">
            <p className="text-sm font-medium text-stone-900">
              Nie masz jeszcze przypisanego instruktora.
            </p>
            <p className="mt-1 text-sm text-stone-500">
              Skontaktuj się z OSK, aby dokończyć przypisanie.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-red-100 bg-red-50/40 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-700">
                {initialsFromName(assignedInstructor.fullName)}
              </div>
              <div>
                <p className="text-lg font-semibold text-stone-900">
                  {assignedInstructor.fullName}
                </p>
                <p className="text-xs text-stone-500">
                  Przypisano: {formatAssignedAt(assignedInstructor.assignedAt)}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Telefon: {assignedInstructor.phoneNumber || "Brak numeru"}
                </p>
              </div>
            </div>

            {assignedInstructor.phoneNumber ? (
              <Button asChild>
                <a href={phoneHref(assignedInstructor.phoneNumber)}>
                  Zadzwoń do instruktora
                </a>
              </Button>
            ) : (
              <Button disabled>Brak numeru telefonu</Button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Pozostali instruktorzy
          </p>
          <span className="text-xs text-stone-500">
            {otherInstructors.length}
          </span>
        </div>

        {otherInstructors.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">
            Brak innych aktywnych instruktorów.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {otherInstructors.map((instructor) => (
              <article
                key={instructor.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-stone-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-700">
                    {initialsFromName(instructor.fullName)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">
                      {instructor.fullName}
                    </p>
                    <p className="text-xs text-stone-500">
                      tel. {instructor.phoneNumber || "brak"}
                    </p>
                  </div>
                </div>

                {instructor.phoneNumber ? (
                  <Button asChild size="sm" variant="secondary">
                    <a href={phoneHref(instructor.phoneNumber)}>Zadzwoń</a>
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" disabled>
                    Brak numeru
                  </Button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
