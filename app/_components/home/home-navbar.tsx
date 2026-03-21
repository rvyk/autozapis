"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
    onAnchorNavigate?.();
    window.scrollTo({ top, behavior: "smooth" });
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <nav className={navClass}>
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-4 px-1 sm:px-6">
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
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/25 bg-white/10 text-white transition hover:bg-white/15 lg:hidden"
          >
            <span className="text-xl leading-none">{isMenuOpen ? "×" : "☰"}</span>
          </button>
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

      {isMenuOpen ? (
        <div id="mobile-nav" className="border-t border-white/10 bg-stone-900/95 px-4 py-4 lg:hidden">
          <ul className="space-y-1">
            {links.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={handleAnchorClick}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${activeSection === item.href ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/8 hover:text-white"}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              href="/logowanie"
              onClick={closeMenu}
              className="rounded-md border border-white/30 bg-white/10 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-white/15"
            >
              Logowanie
            </Link>
            <Link
              href="/rejestracja"
              onClick={closeMenu}
              className="rounded-md bg-red-600 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-red-500"
            >
              Rejestracja
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
