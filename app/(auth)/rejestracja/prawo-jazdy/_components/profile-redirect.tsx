"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/rejestracja/profil");
  }, [router]);

  return null;
}
