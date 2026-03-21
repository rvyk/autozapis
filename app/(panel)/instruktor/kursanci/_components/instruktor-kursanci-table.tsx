"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { StudentItem } from "./instruktor-kursanci-types";

export function InstruktorKursanciTable({
  students,
  loading,
  saving,
  onToggleAssignment,
}: {
  students: StudentItem[];
  loading: boolean;
  saving: boolean;
  onToggleAssignment: (student: StudentItem) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-500">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Kursant
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Kategoria
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Godziny
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Przypisanie
              </th>
              <th scope="col" className="px-6 py-4 text-right font-semibold">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-stone-500"
                >
                  Ladowanie kursantow...
                </td>
              </tr>
            ) : null}

            {!loading && students.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-stone-500"
                >
                  Brak kursantow dla wybranego filtra.
                </td>
              </tr>
            ) : null}

            {!loading
              ? students.map((student) => (
                  <tr
                    key={student.id}
                    className="transition-colors hover:bg-stone-50/50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-stone-900">
                        {student.fullName}
                      </p>
                      <p className="text-xs text-stone-500">
                        tel. {student.phone}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      kat. {student.category}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {student.hoursDone}/{student.hoursTarget}h
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Button
                        size="sm"
                        variant={
                          student.assignedToMe
                            ? "destructiveOutline"
                            : "secondary"
                        }
                        disabled={
                          saving ||
                          (!student.assignedToMe && student.assignedToAnyone)
                        }
                        onClick={() => onToggleAssignment(student)}
                      >
                        {student.assignedToMe
                          ? "Usun przypisanie"
                          : student.assignedToAnyone
                            ? "Przypisany do innego"
                            : "Nieprzypisany"}
                      </Button>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Button
                        asChild
                        size="sm"
                        disabled={!student.assignedToMe}
                      >
                        <Link href={`/instruktor/kursanci/${student.id}`}>
                          Otwórz profil
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
