"use client";

import { usePathname } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { HomeNavbar } from "@/app/_components/home/home-navbar";

export function AuthHeader() {
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
      isScrolled={true}
      isHidden={false}
      activeSection=""
      links={[]}
    />
  );
}
