"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_TRAINING_STUDENTS } from "@/app/(panel)/_lib/mock-driving-data";

export function InstruktorKursanciPageContent() {
  const [students, setStudents] = useState(MOCK_TRAINING_STUDENTS);
  const [filter, setFilter] = useState<"WSZYSCY" | "MOI" | "WOLNI">("MOI");
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignQuery, setAssignQuery] = useState("");

  const filteredStudents = useMemo(() => {
    if (filter === "MOI") return students.filter((student) => student.assignedToMe);
    if (filter === "WOLNI") return students.filter((student) => !student.assignedToMe);
    return students;
  }, [students, filter]);

  const filteredUnassigned = useMemo(() => {
    const query = assignQuery.trim().toLowerCase();

    return students.filter((student) => {
      if (student.assignedToMe) return false;
      if (!query) return true;

      return (
        student.fullName.toLowerCase().includes(query) ||
        student.phone.toLowerCase().includes(query)
      );
    });
  }, [students, assignQuery]);

  function toggleAssignment(studentId: string) {
    setStudents((current) =>
      current.map((student) =>
        student.id === studentId
          ? { ...student, assignedToMe: !student.assignedToMe }
          : student,
      ),
    );
  }

  function getNextRideDate(studentId: string) {
    const student = students.find((item) => item.id === studentId);
    if (!student) return "Nie ustawiono";

    const nextPlannedRide = student.rides
      .filter((ride) => ride.status === "PLANOWANA" && ride.startsAt)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())[0];

    if (!nextPlannedRide) return "Nie ustawiono";

    return new Intl.DateTimeFormat("pl-PL", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(nextPlannedRide.startsAt));
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Moi kursanci</h1>
          <p className="mt-2 text-stone-500">
            Wejdz w profil kursanta, by planowac jazdy, uzupelniac opinie i aktualizowac godziny.
          </p>
        </div>

        <div className="flex items-center gap-2 border border-stone-200 bg-white p-1.5 rounded-xl">
          {([
            ["WSZYSCY", "Wszyscy"],
            ["MOI", "Przypisani"],
            ["WOLNI", "Nieprzypisani"],
          ] as const).map(([value, label]) => (
            <Button
              key={value}
              variant="ghost"
              size="sm"
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold",
                filter === value
                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                  : "text-stone-500 hover:bg-stone-100",
              )}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-900">Przypisz kursanta</p>
            <p className="text-xs text-red-800/80">Przy wiekszej liczbie osob skorzystaj z wyszukiwarki i listy przewijanej.</p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAssignOpen((current) => !current)}
          >
            {isAssignOpen ? "Ukryj liste" : "Otworz liste kursantow"}
          </Button>
        </div>

        {isAssignOpen ? (
          <div className="mt-3 rounded-xl border border-red-100 bg-white p-3">
            <input
              value={assignQuery}
              onChange={(event) => setAssignQuery(event.target.value)}
              placeholder="Szukaj po imieniu lub telefonie"
              className="h-10 w-full rounded-lg border border-stone-300 px-3 text-sm outline-none focus:border-red-500"
            />

            <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
              {filteredUnassigned.length === 0 ? (
                <p className="text-xs font-medium text-stone-500">Brak kursantow do przypisania.</p>
              ) : null}

              {filteredUnassigned.map((student) => (
                <div
                  key={`assign-${student.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{student.fullName}</p>
                    <p className="text-xs text-stone-500">tel. {student.phone} • kat. {student.category}</p>
                  </div>
                  <Button size="sm" onClick={() => toggleAssignment(student.id)}>
                    Przypisz
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-500">
            <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Kursant</th>
                <th scope="col" className="px-6 py-4 font-semibold">Kategoria</th>
                <th scope="col" className="px-6 py-4 font-semibold">Godziny</th>
                <th scope="col" className="px-6 py-4 font-semibold">Kolejna jazda</th>
                <th scope="col" className="px-6 py-4 font-semibold">Przypisanie</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="transition-colors hover:bg-stone-50/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-stone-900">{student.fullName}</p>
                    <p className="text-xs text-stone-500">tel. {student.phone}</p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">kat. {student.category}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {student.hoursDone}/{student.hoursTarget}h
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{getNextRideDate(student.id)}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Button
                      size="sm"
                      variant={student.assignedToMe ? "destructiveOutline" : "secondary"}
                      onClick={() => toggleAssignment(student.id)}
                    >
                      {student.assignedToMe ? "Przypisany" : "Nieprzypisany"}
                    </Button>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Button asChild size="sm">
                      <Link href={`/instruktor/kursanci/${student.id}`}>Otworz profil</Link>
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
