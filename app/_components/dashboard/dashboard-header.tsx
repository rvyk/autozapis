"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const { signOut } = useAuth();
  const { user } = useUser();

  const userInitials = user?.firstName
    ? `${user.firstName.charAt(0)}${user.lastName?.charAt(0) || ""}`
    : "AU";

  return (
    <header className="relative z-50 w-full border-b border-red-100/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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

        <div className="flex items-center gap-4">
          <button className="relative rounded-full p-2 text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
              />
            </svg>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500" />
          </button>

          <div className="h-6 w-px bg-stone-200" />

          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end sm:flex">
              <span className="text-sm font-semibold text-stone-900">
                {user?.firstName
                  ? `${user.firstName} ${user.lastName || ""}`
                  : "Użytkownik"}
              </span>
              <span className="text-xs text-stone-500 hover:text-red-600">
                <button onClick={() => signOut({ redirectUrl: "/" })}>
                  Wyloguj się
                </button>
              </span>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 font-semibold text-red-700 ring-2 ring-white">
              {userInitials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
