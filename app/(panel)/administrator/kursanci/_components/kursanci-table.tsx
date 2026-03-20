"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  STATUS_LABELS,
  type KursantListItem,
  type KursantStatusFilter,
} from "./kursanci-types";
import { formatDate, getStatusBadgeClass } from "./kursanci-utils";

export function KursanciTable({
  kursanci,
  disabled,
  onOpenPkk,
  onChangeStatus,
  onRemovePkk,
  onEditPayment,
}: {
  kursanci: KursantListItem[];
  disabled: boolean;
  onOpenPkk: (id: string) => void;
  onChangeStatus: (
    id: string,
    status: Extract<KursantStatusFilter, "AKTYWNY" | "OCZEKUJACY">,
  ) => void;
  onRemovePkk: (id: string) => void;
  onEditPayment: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-stone-500">
          <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase text-stone-500">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold">Imie i nazwisko</th>
              <th scope="col" className="px-6 py-4 font-semibold">Email</th>
              <th scope="col" className="px-6 py-4 font-semibold">Data zapisu</th>
              <th scope="col" className="px-6 py-4 font-semibold">Kategoria</th>
              <th scope="col" className="px-6 py-4 font-semibold">Płatności</th>
              <th scope="col" className="px-6 py-4 font-semibold">PKK</th>
              <th scope="col" className="px-6 py-4 font-semibold">Status</th>
              <th scope="col" className="px-6 py-4 text-right font-semibold">Akcje</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {kursanci.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-stone-500">
                  Brak kursantow dla wybranego filtra.
                </td>
              </tr>
            ) : null}

            {kursanci.map((kursant) => (
              <tr key={kursant.id} className="transition-colors hover:bg-stone-50/50">
                <td className="whitespace-nowrap px-6 py-4 font-medium text-stone-900">{kursant.fullName}</td>
                <td className="whitespace-nowrap px-6 py-4">{kursant.email}</td>
                <td className="whitespace-nowrap px-6 py-4">{formatDate(kursant.registeredAt)}</td>
                <td className="whitespace-nowrap px-6 py-4">kat. {kursant.trainingCategory}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-stone-600">Zapłacono: <span className="font-semibold">{kursant.amountPaid} zł</span></span>
                    {kursant.coursePrice - kursant.amountPaid > 0 ? (
                      <span className="text-red-600 font-medium">Zaległość: {kursant.coursePrice - kursant.amountPaid} zł</span>
                    ) : (
                      <span className="text-green-600 font-medium">Opłacono całość</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {kursant.pkkFile ? (
                    <div className="flex flex-col gap-1">
                      <span className="max-w-64 truncate text-xs text-stone-700" title={kursant.pkkFile.originalFileName}>
                        {kursant.pkkFile.originalFileName}
                      </span>
                      <span className="text-[11px] text-stone-500">{formatDate(kursant.pkkFile.uploadedAt)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400">Brak pliku</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                      getStatusBadgeClass(kursant.status),
                    )}
                  >
                    {STATUS_LABELS[kursant.status]}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                      onClick={() => onEditPayment(kursant.id)}
                    >
                      Płatności
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={disabled || !kursant.pkkFile}
                      onClick={() => onOpenPkk(kursant.id)}
                    >
                      Podglad PKK
                    </Button>
                    {kursant.status === "AKTYWNY" ? (
                      <Button
                        variant="destructiveOutline"
                        size="sm"
                        disabled={disabled}
                        onClick={() => onChangeStatus(kursant.id, "OCZEKUJACY")}
                      >
                        Cofnij aktywacje
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        disabled={disabled || !kursant.pkkFile}
                        onClick={() => onChangeStatus(kursant.id, "AKTYWNY")}
                      >
                        Aktywuj konto
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                      disabled={disabled || !kursant.pkkFile}
                      onClick={() => onRemovePkk(kursant.id)}
                    >
                      Odrzuc PKK
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
