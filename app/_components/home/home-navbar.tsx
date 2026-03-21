"use client";

import Link from "next/link";
import type { MouseEvent } from "react";

type NavbarLink = {
  href: string;
  label: string;
};

type HomeNavbarProps = {
  isScrolled: boolean;
  isHidden: boolean;
  activeSection: string;
  links?: NavbarLink[];
  onAnchorNavigate?: () => void;
};

export function HomeNavbar({
  isScrolled,
  isHidden,
  activeSection,
  links = [
    { href: "#kursy", label: "Kursy" },
    { href: "#instruktorzy", label: "Instruktorzy" },
    { href: "#cennik", label: "Cennik" },
    { href: "#kontakt", label: "Kontakt" },
  ],
  onAnchorNavigate,
}: HomeNavbarProps) {
  const brandClass = "text-2xl font-semibold tracking-tight text-white";
  const linkClass = (href: string) =>
    `rounded-lg px-4 py-2 text-sm font-medium transition ${activeSection === href ? "text-white" : "text-white/70 hover:text-white"}`;

  const navClass = [
    "fixed inset-x-0 top-0 z-50 h-18 border-b border-white/10 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 px-4 transition-all duration-500 sm:px-6",
    isScrolled ? "h-15" : "",
    isHidden ? "-translate-y-[105%] opacity-0 pointer-events-none" : "",
  ].join(" ");

  function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;
    const target = document.querySelector(href) as HTMLElement | null;
    if (!target) return;
    event.preventDefault();
    const navHeight = 60;
    const top =
      target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    onAnchorNavigate?.();
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <nav className={navClass}>
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className={brandClass} aria-label="Strona główna">
            Auto<span className="text-red-500">Zapis</span>
          </Link>

          {links.length > 0 ? (
            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={handleAnchorClick}
                    className={linkClass(item.href)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/logowanie"
              className="rounded-md border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Logowanie
            </Link>
            <Link
              href="/rejestracja"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              Rejestracja
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
