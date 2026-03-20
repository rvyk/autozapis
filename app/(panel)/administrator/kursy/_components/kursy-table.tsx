"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CourseItem } from "./kursy-types";
import {
  categoryToLabel,
  formatPrice,
  formatStartDate,
  getSpotsLabel,
  statusToClass,
  statusToLabel,
} from "./kursy-utils";

export function KursyTable({
  courses,
  pending,
  onEdit,
  onDelete,
}: {
  courses: CourseItem[];
  pending: boolean;
  onEdit: (course: CourseItem) => void;
  onDelete: (courseId: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-500">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Kurs</th>
              <th scope="col" className="px-6 py-4 font-semibold">Kategoria</th>
              <th scope="col" className="px-6 py-4 font-semibold">Start</th>
              <th scope="col" className="px-6 py-4 font-semibold">Czas trwania</th>
              <th scope="col" className="px-6 py-4 font-semibold">Cena</th>
              <th scope="col" className="px-6 py-4 font-semibold">Zapisanych</th>
              <th scope="col" className="px-6 py-4 font-semibold">Status</th>
              <th scope="col" className="px-6 py-4 text-right font-semibold">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {courses.map((course) => (
              <tr key={course.id} className="transition-colors hover:bg-stone-50/50">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-stone-900">{course.title}</td>
                <td className="whitespace-nowrap px-6 py-4">{categoryToLabel(course.category)}</td>
                <td className="whitespace-nowrap px-6 py-4">{formatStartDate(course.startDate)}</td>
                <td className="whitespace-nowrap px-6 py-4">{course.duration}</td>
                <td className="whitespace-nowrap px-6 py-4">{formatPrice(course.pricePln)}</td>
                <td className="whitespace-nowrap px-6 py-4">{getSpotsLabel(course)}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex min-w-25 items-center justify-center rounded-full px-2.5 py-1 text-xs font-medium",
                      statusToClass(course.status),
                    )}
                  >
                    {statusToLabel(course.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={pending}
                      onClick={() => onEdit(course)}
                    >
                      Edytuj
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      disabled={pending}
                      onClick={() => onDelete(course.id)}
                    >
                      Usuń
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
