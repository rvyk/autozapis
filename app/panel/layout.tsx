import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { PanelSidebar } from "./_components/panel-sidebar";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  // We fetch minimal data to check status inside layout
  let dbUser = null;
  if (userId) {
    dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { isAccountActive: true, role: true },
    });
  }

  // If user is active (and not admin), they get the complex dashboard wrapper
  const isActiveKursant =
    dbUser?.isAccountActive && dbUser?.role !== "OSK_ADMINISTRATOR_ROLE";

  return (
    <div className="relative min-h-dvh bg-stone-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_25%,rgba(220,38,38,0.06),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(220,38,38,0.04),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b from-white/50 to-transparent" />

      {isActiveKursant ? (
        <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:px-8">
          <PanelSidebar />
          <main className="flex-1 min-w-0 rounded-3xl border border-red-100/80 bg-white/95 p-6 shadow-[0_24px_70px_-28px_rgba(220,38,38,0.14)] backdrop-blur-sm sm:p-8">
            {children}
          </main>
        </div>
      ) : (
        <div className="relative">{children}</div>
      )}
    </div>
  );
}
