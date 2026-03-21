"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  { value: "A", label: "Kategoria A" },
  { value: "B", label: "Kategoria B" },
] as const;

type Category = (typeof CATEGORY_OPTIONS)[number]["value"];

export function MaterialyPageContent() {
  const [category, setCategory] = useState<Category>("B");

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Materiały Edukacyjne"
        description="Ucz się teorii, testuj swoją wiedzę i przygotowuj do egzaminu państwowego."
      />

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-stone-900">
          Baza pytań egzaminacyjnych
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Wybierz kategorię i tryb nauki.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {CATEGORY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setCategory(opt.value)}
              className={cn(
                "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
                category === opt.value
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-stone-200 text-stone-600 hover:bg-stone-50",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border border-stone-200 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-900">Egzamin próbny</h3>
            <p className="text-sm text-stone-500">
              32 pytania (20 podstawowych + 12 specjalistycznych), limit czasu 25
              minut.
            </p>
            <Link href={`/kursant/materialy/egzamin?kat=${category}`}>
              <Button className="w-full">Rozpocznij egzamin</Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-stone-200 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <svg
                className="h-5 w-5 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-900">Ćwiczenia</h3>
            <p className="text-sm text-stone-500">
              Pojedyncze pytania z natychmiastową informacją zwrotną. Ucz się w
              swoim tempie.
            </p>
            <Link href={`/kursant/materialy/cwiczenia?kat=${category}`}>
              <Button variant="secondary" className="w-full">
                Zacznij ćwiczyć
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-stone-200 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <svg
                className="h-5 w-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 1.343-3 3 0 .477.103.93.285 1.336l-3.08 4.18a1 1 0 00.8 1.516h10a1 1 0 00.8-1.516l-3.08-4.18A2.99 2.99 0 0015 11c0-1.657-1.343-3-3-3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 12v5"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-900">Budowa silnika</h3>
            <p className="text-sm text-stone-500">
              Interaktywny przewodnik po elementach silnika z opisami i hotspotami.
            </p>
            <Link href="/kursant/materialy/silnik">
              <Button variant="secondary" className="w-full">
                Otwórz przewodnik
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
