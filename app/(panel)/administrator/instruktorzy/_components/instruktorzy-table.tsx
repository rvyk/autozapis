"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InstructorListItem } from "./instruktorzy-types";
import {
  formatDate,
  getStatusClass,
  getStatusLabel,
} from "./instruktorzy-utils";

function PermissionToggle({
  checked,
  disabled,
  label,
  onToggle,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-7 w-12 items-center rounded-full border transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30",
        checked ? "border-red-200 bg-red-100" : "border-stone-300 bg-stone-100",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

export function InstruktorzyTable({
  instructors,
  pendingId,
  onToggleStatus,
  onTogglePermission,
}: {
  instructors: InstructorListItem[];
  pendingId: string | null;
  onToggleStatus: (instructor: InstructorListItem) => void;
  onTogglePermission: (
    instructor: InstructorListItem,
    permission: "canTeachPractice" | "canTeachTheory",
  ) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-500">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">
                Instruktor
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Email
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Data dołączenia
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-center font-semibold">
                Jazdy
              </th>
              <th scope="col" className="px-6 py-4 text-center font-semibold">
                Wykłady
              </th>
              <th scope="col" className="px-6 py-4 text-right font-semibold">
                Akcje
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {instructors.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-sm text-stone-500"
                >
                  Brak instruktorow dla wybranego filtra.
                </td>
              </tr>
            ) : null}

            {instructors.map((instructor) => {
              const isPending = pendingId === instructor.id;

              return (
                <tr
                  key={instructor.id}
                  className="transition-colors hover:bg-stone-50/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-stone-900">
                    {instructor.fullName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {instructor.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {formatDate(instructor.joinedAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                        getStatusClass(instructor.status),
                      )}
                    >
                      {getStatusLabel(instructor.status)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <PermissionToggle
                      checked={instructor.canTeachPractice}
                      disabled={Boolean(pendingId)}
                      onToggle={() =>
                        onTogglePermission(instructor, "canTeachPractice")
                      }
                      label={`Uprawnienie jazdy: ${instructor.fullName}`}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <PermissionToggle
                      checked={instructor.canTeachTheory}
                      disabled={Boolean(pendingId)}
                      onToggle={() =>
                        onTogglePermission(instructor, "canTeachTheory")
                      }
                      label={`Uprawnienie wykłady: ${instructor.fullName}`}
                    />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <Button
                      variant={
                        instructor.status === "AKTYWNY"
                          ? "destructiveOutline"
                          : "primary"
                      }
                      size="sm"
                      disabled={Boolean(pendingId)}
                      onClick={() => onToggleStatus(instructor)}
                    >
                      {isPending
                        ? "Zapisywanie..."
                        : instructor.status === "AKTYWNY"
                          ? "Dezaktywuj"
                          : "Aktywuj"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
