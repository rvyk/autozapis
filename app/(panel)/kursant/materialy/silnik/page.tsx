import Link from "next/link";
import { SectionHeader } from "@/app/_components/dashboard/section-header";

export default function SilnikMaterialyPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <SectionHeader
        title="Budowa silnika"
        description="Interaktywny przewodnik z mapą silnika, hotspotami i opisami elementów."
      />

      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">

        <div className="h-[72vh] w-full overflow-hidden rounded-xl border border-stone-200">
          <iframe
            src="/silnik/budowa_silnika.html"
            className="h-full w-full"
            title="Budowa silnika"
            allowFullScreen
          />
        </div>

        <div className="mt-4 flex justify-between">
          <Link
            href="/kursant/materialy"
            className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Powrót do materiałów
          </Link>
          <a
            href="/silnik/budowa_silnika.html"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            Otwórz w pełnym oknie
          </a>
        </div>
      </div>
    </div>
  );
}
