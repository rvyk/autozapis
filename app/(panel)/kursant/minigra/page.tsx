import Link from "next/link";
import { SectionHeader } from "@/app/_components/dashboard/section-header";

export default function MinigraPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <SectionHeader
        title="Minigra"
        description="Szybka rozrywka w minigrze."
      />

      <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">

        <div className="h-[72vh] w-full overflow-hidden rounded-xl border border-stone-200">
          <iframe
            src="/minigra/minigra_nowa.html"
            className="h-full w-full"
            title="Minigra"
            allowFullScreen
          />
        </div>

        <div className="mt-4 flex justify-between">
          <Link
            href="/kursant"
            className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Powrót do panelu kursanta
          </Link>
          <a
            href="/minigra/minigra_nowa.html"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            Otwórz minigrę w nowym oknie
          </a>
        </div>
      </div>
    </div>
  );
}
