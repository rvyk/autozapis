"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function AuthHeader() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4">
      <Link
        href="/"
        className="text-lg font-bold tracking-tight text-stone-900"
      >
        Auto<span className="text-red-600">zapis</span>
      </Link>

      <nav className="flex items-center gap-2">
        {isSignedIn ? (
          <>
            <span className="text-sm text-stone-500">
              {user?.firstName || user?.primaryEmailAddress?.emailAddress}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              Wyloguj się
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/logowanie">Zaloguj się</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/rejestracja">Zarejestruj się</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
