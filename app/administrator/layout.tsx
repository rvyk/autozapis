import { AdminSidebar } from "./_components/admin-sidebar";

export default function AdministratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-stone-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_25%,rgba(220,38,38,0.06),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(220,38,38,0.04),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-white/50 to-transparent" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <AdminSidebar />
        <main className="flex-1 min-w-0 rounded-3xl border border-red-100/80 bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(220,38,38,0.14)] backdrop-blur-sm sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
