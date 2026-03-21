import Link from "next/link";

export function DashboardBrand() {
  return (
    <div className="flex items-center gap-6">
      <Link
        href="/"
        className="text-xl font-bold tracking-tight text-stone-900 transition-colors hover:text-red-600"
      >
        Auto<span className="text-red-600">Zapis</span>
      </Link>
      <div className="hidden h-6 w-px bg-stone-200 sm:block" />
      <p className="hidden text-sm font-medium text-stone-500 sm:block">
        System obsługi Ośrodka Szkolenia Kierowców
      </p>
    </div>
  );
}
