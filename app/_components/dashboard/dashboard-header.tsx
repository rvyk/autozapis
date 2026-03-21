"use client";

import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { DashboardBrand } from "./header/dashboard-brand";
import { DashboardNotifications } from "./header/dashboard-notifications";
import { DashboardUserProfile } from "./header/dashboard-user-profile";

export function DashboardHeader() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const canShowNotifications =
    pathname?.startsWith("/kursant") || pathname?.startsWith("/instruktor");

  const userInitials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`
    : "AU";
  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Użytkownik";

  function handleSignOut() {
    void signOut({ redirectUrl: "/" });
  }

  return (
    <header className="relative z-50 w-full border-b border-red-100/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <DashboardBrand />

        <div className="flex items-center gap-2 sm:gap-4">
          {canShowNotifications ? <DashboardNotifications /> : null}

          <div className="hidden h-6 w-px bg-stone-200 sm:block" />

          <DashboardUserProfile
            fullName={fullName}
            initials={userInitials}
            onSignOut={handleSignOut}
          />
        </div>
      </div>
    </header>
  );
}
