"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SectionHeader } from "@/app/_components/dashboard/section-header";
import { KursanciFilterTabs } from "./kursanci-filter-tabs";
import { KursanciTable } from "./kursanci-table";
import { KursanciPaymentDialog } from "./kursanci-payment-dialog";
import type {
  KursantListItem,
  KursantResolvedStatus,
  KursantStatusFilter,
  RequestError,
} from "./kursanci-types";
import { filterToQueryValue, getErrorMessage } from "./kursanci-utils";

export function KursanciPageContent({
  initialKursanci,
  initialFilter,
}: {
  initialKursanci: KursantListItem[];
  initialFilter: KursantStatusFilter;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isMutating, setIsMutating] = useState(false);
  const [filter, setFilter] = useState<KursantStatusFilter>(initialFilter);
  const [kursanci, setKursanci] = useState<KursantListItem[]>(initialKursanci);
  const [error, setError] = useState<string | null>(null);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedKursantForPayment, setSelectedKursantForPayment] = useState<KursantListItem | null>(null);

  const filteredKursanci = useMemo(
    () =>
      kursanci.filter(
        (kursant) => filter === "WSZYSCY" || kursant.status === filter,
      ),
    [kursanci, filter],
  );

  const stats = useMemo(() => {
    let oczekujacy = 0;
    let aktywni = 0;
    let brakPkk = 0;

    for (const kursant of kursanci) {
      if (kursant.status === "OCZEKUJACY") oczekujacy += 1;
      if (kursant.status === "AKTYWNY") aktywni += 1;
      if (kursant.status === "BRAK_PKK") brakPkk += 1;
    }

    return {
      all: kursanci.length,
      oczekujacy,
      aktywni,
      brakPkk,
    };
  }, [kursanci]);

  function updateFilter(nextFilter: KursantStatusFilter) {
    setFilter(nextFilter);

    startTransition(() => {
      const search = new URLSearchParams(window.location.search);
      const queryValue = filterToQueryValue(nextFilter);

      if (!queryValue) {
        search.delete("status");
      } else {
        search.set("status", queryValue);
      }

      const queryString = search.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname);
    });
  }

  async function changeAccountStatus(
    kursantId: string,
    nextStatus: "AKTYWNY" | "OCZEKUJACY",
  ) {
    setError(null);
    setIsMutating(true);

    try {
      const response = await fetch(`/api/admin/kursanci/${kursantId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const payload = (await response.json().catch(() => null)) as {
        kursant?: { status: KursantResolvedStatus };
        error?: RequestError;
      } | null;

      if (!response.ok || !payload?.kursant) {
        setError(getErrorMessage(payload?.error ?? "UNKNOWN"));
        return;
      }

      setKursanci((current) =>
        current.map((kursant) =>
          kursant.id === kursantId
            ? { ...kursant, status: payload.kursant?.status ?? kursant.status }
            : kursant,
        ),
      );
    } catch {
      setError(getErrorMessage("UNKNOWN"));
    } finally {
      setIsMutating(false);
    }
  }

  async function removePkkFile(kursantId: string) {
    setError(null);

    const shouldDelete = window.confirm(
      "Usunąć dokument PKK tego kursanta? Kursant będzie musiał dodać nowy plik.",
    );

    if (!shouldDelete) {
      return;
    }

    setIsMutating(true);

    try {
      const response = await fetch(`/api/admin/kursanci/${kursantId}/pkk`, {
        method: "DELETE",
      });

      const payload = (await response.json().catch(() => null)) as {
        kursant?: { status: KursantResolvedStatus };
        error?: RequestError;
      } | null;

      if (!response.ok || !payload?.kursant) {
        setError(getErrorMessage(payload?.error ?? "UNKNOWN"));
        return;
      }

      setKursanci((current) =>
        current.map((kursant) =>
          kursant.id === kursantId
            ? {
                ...kursant,
                pkkFile: null,
                status: payload.kursant?.status ?? "BRAK_PKK",
              }
            : kursant,
        ),
      );
    } catch {
      setError(getErrorMessage("UNKNOWN"));
    } finally {
      setIsMutating(false);
    }
  }

  async function openPkkFile(kursantId: string) {
    setError(null);
    setIsMutating(true);

    try {
      const response = await fetch(`/api/admin/kursanci/${kursantId}/pkk-url`, {
        cache: "no-store",
      });

      const payload = (await response.json().catch(() => null)) as {
        url?: string;
        error?: RequestError;
      } | null;

      if (!response.ok || !payload?.url) {
        setError(getErrorMessage(payload?.error ?? "UNKNOWN"));
        return;
      }

      window.open(payload.url, "_blank", "noopener,noreferrer");
    } catch {
      setError(getErrorMessage("UNKNOWN"));
    } finally {
      setIsMutating(false);
    }
  }

  function handleOpenPaymentDialog(kursantId: string) {
    const kursant = kursanci.find(k => k.id === kursantId);
    if (kursant) {
      setSelectedKursantForPayment(kursant);
      setPaymentDialogOpen(true);
    }
  }

  async function handleSavePayment(kursantId: string, coursePrice: number, amountPaid: number) {
    setError(null);
    setIsMutating(true);

    try {
      const response = await fetch(`/api/admin/kursanci/${kursantId}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coursePrice, amountPaid }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        setError(getErrorMessage(payload?.error ?? "UNKNOWN"));
        return;
      }

      setKursanci((current) =>
        current.map((kursant) =>
          kursant.id === kursantId
            ? { ...kursant, coursePrice, amountPaid }
            : kursant,
        ),
      );
    } catch {
      setError(getErrorMessage("UNKNOWN"));
    } finally {
      setIsMutating(false);
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 animate-in fade-in duration-300 ease-out">
      <SectionHeader
        title="Kursanci"
        description="Zarządzaj listą zapisanych osób i akceptuj ich dokumenty PKK."
      />

      <KursanciFilterTabs
        filter={filter}
        stats={stats}
        disabled={isPending || isMutating}
        onChange={updateFilter}
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <KursanciTable
        kursanci={filteredKursanci}
        disabled={isPending || isMutating}
        onOpenPkk={openPkkFile}
        onChangeStatus={changeAccountStatus}
        onRemovePkk={removePkkFile}
        onEditPayment={handleOpenPaymentDialog}
      />

      <KursanciPaymentDialog
        isOpen={paymentDialogOpen}
        onClose={() => setPaymentDialogOpen(false)}
        kursant={selectedKursantForPayment}
        onSave={handleSavePayment}
      />
    </div>
  );
}
