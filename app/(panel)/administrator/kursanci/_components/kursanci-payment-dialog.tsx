"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  if (!isOpen || !kursant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-stone-900">Edytuj płatności</h2>
        <p className="mt-1 text-sm text-stone-500">Zarządzaj opłatami kursanta {kursant.fullName}.</p>
        <div className="mt-6 grid gap-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="coursePrice" className="text-sm font-medium text-right">Cena kursu</label>
            <Input
              id="coursePrice"
              type="number"
              value={coursePrice}
              onChange={(e) => setCoursePrice(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="amountPaid" className="text-sm font-medium text-right">Zapłacono</label>
            <Input
              id="amountPaid"
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Anuluj</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>{isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}</Button>
        </div>
      </div>
    </div>
  );
}
