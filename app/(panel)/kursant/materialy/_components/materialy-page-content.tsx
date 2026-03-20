"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { cn } from "@/lib/utils";

const MODULES = [
  {
    id: 1,
    title: "Moduł 1: Przepisy Ogólne",
    status: "Ukończono",
    progress: 100,
  },
  {
    id: 2,
    title: "Moduł 2: Znaki i Sygnały Drogowe",
    status: "W trakcie",
    progress: 65,
  },
  { id: 3, title: "Moduł 3: Skrzyżowania", status: "Zablokowane", progress: 0 },
  {
    id: 4,
    title: "Moduł 4: Pierwsza Pomoc",
    status: "Zablokowane",
    progress: 0,
  },
] as const;

const FILES = [
  "Instrukcja Plac Manewrowy.pdf",
  "Opis świateł w Hyundai i20.pdf",
] as const;

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
        description="Ucz się teorii, testuj swoje wiedzę i przygotowuj do egzaminu państwowego."
      />

      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-stone-900">Baza pytań egzaminacyjnych</h2>
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
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-900">Egzamin próbny</h3>
            <p className="text-sm text-stone-500">
              32 pytania, limit czasu 25 minut. Taki sam format jak egzamin państwowy.
            </p>
            <Link href={`/kursant/materialy/egzamin?kat=${category}`}>
              <Button className="w-full">Rozpocznij egzamin</Button>
            </Link>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-stone-200 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-900">Ćwiczenia</h3>
            <p className="text-sm text-stone-500">
              Pojedyncze pytania z natychmiastową informacją zwrotną. Ucz się w swoim tempie.
            </p>
            <Link href={`/kursant/materialy/cwiczenia?kat=${category}`}>
              <Button variant="secondary" className="w-full">Zacznij ćwiczyć</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-stone-900">
              Postęp w modułach testowych
            </h2>
            <div className="space-y-4">
              {MODULES.map((module) => (
                <div
                  key={module.id}
                  className="group flex flex-col gap-2 rounded-xl border border-stone-100 p-4 transition-colors hover:bg-stone-50"
                >
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span
                      className={
                        module.status === "Zablokowane"
                          ? "text-stone-400"
                          : "text-stone-900"
                      }
                    >
                      {module.title}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs",
                        module.status === "Ukończono"
                          ? "bg-green-100 text-green-700"
                          : module.status === "W trakcie"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-stone-100 text-stone-400",
                      )}
                    >
                      {module.status}
                    </span>
                  </div>

                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-stone-100">
                    <div
                      className={cn(
                        "absolute top-0 left-0 h-full rounded-full",
                        module.progress === 100 ? "bg-green-500" : "bg-red-500",
                      )}
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 font-semibold text-stone-900">
              Przydatne pliki
            </h3>
            <ul className="space-y-3">
              {FILES.map((file) => (
                <li key={file}>
                  <Link
                    href="#"
                    className="flex items-center gap-3 text-sm font-medium text-stone-600 transition-colors hover:text-red-600"
                  >
                    <svg
                      className="h-5 w-5 text-stone-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    {file}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
