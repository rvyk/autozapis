"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TrainingStudent } from "./instruktor-kursant-details-types";

export function InstruktorKursantDetailsHeader({
  student,
  saving,
  onAddRide,
}: {
  student: Pick<TrainingStudent, "fullName" | "category" | "phone">;
  saving: boolean;
  onAddRide: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Profil kursanta</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-stone-900">{student.fullName}</h1>
        <p className="mt-2 text-stone-500">kat. {student.category} • tel. {student.phone}</p>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/instruktor/kursanci">Powrot do listy</Link>
        </Button>
        <Button size="sm" onClick={onAddRide} disabled={saving}>
          Dodaj jazde
        </Button>
      </div>
    </div>
  );
}
