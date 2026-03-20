"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

type KursanciPaymentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  kursant: { id: string; fullName: string; coursePrice: number; amountPaid: number } | null;
  onSave: (id: string, coursePrice: number, amountPaid: number) => Promise<void>;
};

export function KursanciPaymentDialog({ isOpen, onClose, kursant, onSave }: KursanciPaymentDialogProps) {
  const [coursePrice, setCoursePrice] = useState(kursant?.coursePrice ?? 3000);
  const [amountPaid, setAmountPaid] = useState(kursant?.amountPaid ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (kursant) {
      setCoursePrice(kursant.coursePrice);
      setAmountPaid(kursant.amountPaid);
    }
  }, [kursant]);

  const handleSave = async () => {
    if (!kursant) return;
    setIsSubmitting(true);
    try {
      await onSave(kursant.id, Number(coursePrice), Number(amountPaid));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !kursant || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] overflow-y-auto p-4">
      <Button
        type="button"
        aria-label="Zamknij"
        onClick={onClose}
        variant="ghost"
        className="absolute inset-0 h-auto w-auto rounded-none bg-stone-950/45 backdrop-blur-[2px] hover:bg-stone-950/45"
      />

      <div className="relative mx-auto my-10 w-full max-w-md rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_24px_80px_-30px_rgba(0,0,0,0.2)] animate-in zoom-in-95 fade-in duration-200">
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">Edytuj płatności</h2>
            <p className="mt-1 text-sm text-stone-500">Zarządzaj opłatami kursanta {kursant.fullName}.</p>
          </div>

          <Button
            type="button"
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Zamknij okno"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor="payment-course-price">
              Cena kursu
            </label>
            <input
              id="payment-course-price"
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm text-stone-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-stone-800" htmlFor="payment-amount-paid">
              Zapłacono
            </label>
            <input
              id="payment-amount-paid"
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="h-11 w-full rounded-xl border border-stone-300 px-3 text-sm text-stone-900 outline-none transition-colors focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="secondary" disabled={isSubmitting}>
              Anuluj
            </Button>
            <Button type="button" onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
