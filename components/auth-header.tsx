"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { HomeNavbar } from "@/app/_components/home/home-navbar";

export function AuthHeader() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();

  if (
    pathname === "/" ||
    pathname?.startsWith("/administrator") ||
    pathname?.startsWith("/kursant") ||
    pathname?.startsWith("/instruktor")
  ) {
    return null;
  }

  return (
    <HomeNavbar
      isSignedIn={Boolean(isSignedIn)}
      userFirstName={user?.firstName}
      isScrolled={true}
      isHidden={false}
      activeSection=""
      mobileOpen={false}
      onToggleMobile={() => undefined}
      onCloseMobile={() => undefined}
      links={[]}
      showMobileMenu={false}
    />
  );
}
