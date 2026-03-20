"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS = ["Wszyscy", "Oczekujący", "W trakcie kursu", "Zakończony"] as const;

const MOCK_KURSANCI = [
  { id: 1, name: "Jan Kowalski", email: "jan@example.com", status: "Oczekujący", date: "20.03.2026" },
  { id: 2, name: "Anna Nowak", email: "anna@example.com", status: "W trakcie kursu", date: "15.03.2026" },
  { id: 3, name: "Piotr Wiśniewski", email: "piotr@example.com", status: "Zakończony", date: "10.02.2026" },
  { id: 4, name: "Maria Wójcik", email: "maria@example.com", status: "Oczekujący", date: "19.03.2026" },
  { id: 5, name: "Kamil Kamiński", email: "kamil@example.com", status: "W trakcie kursu", date: "01.03.2026" },
];

export function KursanciPageContent() {
  const [filter, setFilter] = useState<(typeof FILTER_OPTIONS)[number]>("Wszyscy");

  const filteredKursanci = MOCK_KURSANCI.filter(
    (kursant) => filter === "Wszyscy" || kursant.status === filter,
  );

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Kursanci</h1>
          <p className="mt-2 text-stone-500">Zarządzaj listą zapisanych osób i akceptuj ich dokumenty PKK.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary">Export CSV</Button>
          <Button>Dodaj ręcznie</Button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-stone-200 pb-4">
        {FILTER_OPTIONS.map((option) => (
          <Button
            key={option}
            variant="ghost"
            size="sm"
            onClick={() => setFilter(option)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium",
              filter === option
                ? "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800"
                : "text-stone-500 hover:bg-stone-100 hover:text-stone-900",
            )}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-500">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Imię i nazwisko</th>
                <th scope="col" className="px-6 py-4 font-semibold">Email</th>
                <th scope="col" className="px-6 py-4 font-semibold">Data zapisu</th>
                <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredKursanci.map((kursant) => (
                <tr key={kursant.id} className="transition-colors hover:bg-stone-50/50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-stone-900">{kursant.name}</td>
                  <td className="whitespace-nowrap px-6 py-4">{kursant.email}</td>
                  <td className="whitespace-nowrap px-6 py-4">{kursant.date}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        kursant.status === "Oczekujący"
                          ? "bg-amber-100 text-amber-800"
                          : kursant.status === "W trakcie kursu"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800",
                      )}
                    >
                      {kursant.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      Zarządzaj
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
