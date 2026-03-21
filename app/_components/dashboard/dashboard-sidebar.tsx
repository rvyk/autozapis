"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { type DashboardSidebarConfig } from "./sidebar-config";
import {
  AcademicCapIcon,
  BookOpenIcon,
  CarIcon,
  GamepadIcon,
  GridIcon,
  MegaphoneIcon,
  TicketIcon,
  UsersIcon,
} from "./sidebar-icons";

type DashboardSidebarProps = {
  config: DashboardSidebarConfig;
};

function isNavItemActive(pathname: string, href: string) {
  const isRootItem = href.split("/").filter(Boolean).length === 1;

  if (isRootItem) {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export function DashboardSidebar({ config }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const iconByName = {
    grid: GridIcon,
    users: UsersIcon,
    "academic-cap": AcademicCapIcon,
    car: CarIcon,
    megaphone: MegaphoneIcon,
    "book-open": BookOpenIcon,
    ticket: TicketIcon,
    gamepad: GamepadIcon,
  } as const;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navList = (
    <nav className="space-y-1">
      {config.navItems.map((item) => {
        const isActive = isNavItemActive(pathname, item.href);
        const Icon = iconByName[item.icon];

        if (item.disabled) {
          return (
            <div
              key={item.href}
              aria-disabled
              className="flex cursor-not-allowed items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-600/80"
            >
              <span className="text-stone-700/70">
                <Icon className="h-5 w-5" />
              </span>
              {item.label}
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-red-600/15 text-red-400 shadow-[inset_0_0_0_1px_rgba(220,38,38,0.2)]"
                : "text-stone-400 hover:bg-stone-800/60 hover:text-white",
            )}
          >
            <span
              className={cn(
                "transition-colors",
                isActive ? "text-red-400" : "text-stone-500",
              )}
            >
              <Icon className="h-5 w-5" />
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="mb-4 overflow-hidden rounded-2xl bg-linear-to-br from-stone-900 via-stone-900 to-stone-950 p-4 shadow-xl lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
              {config.badgeLabel}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            className="inline-flex h-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-3 text-sm font-medium text-white"
          >
            {isMobileMenuOpen ? "Zamknij" : "Menu"}
          </button>
        </div>
        {isMobileMenuOpen ? <div className="mt-4">{navList}</div> : null}
      </aside>

      <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 overflow-hidden rounded-3xl bg-linear-to-br from-stone-900 via-stone-900 to-stone-950 shadow-2xl lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-6 p-8 pb-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-red-400">
              {config.badgeLabel}
            </span>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">{config.title}</h2>
            <p className="mt-0.5 text-xs text-stone-500">{config.description}</p>
          </div>

          <div className="h-px bg-linear-to-r from-red-500/30 via-stone-700 to-transparent" />
        </div>

        <div className="flex-1 p-4">{navList}</div>

        <div className="border-t border-stone-800 px-8 py-6">
          <p className="text-xs font-medium text-stone-600">{config.footerPrimary}</p>
          <p className="mt-0.5 text-xs text-stone-700">{config.footerSecondary}</p>
        </div>
      </aside>
    </>
  );
}
