export type DashboardIconName =
  | "grid"
  | "users"
  | "academic-cap"
  | "car"
  | "megaphone"
  | "book-open"
  | "ticket";

export type DashboardNavItem = {
  href: string;
  label: string;
  icon: DashboardIconName;
};

export type DashboardSidebarConfig = {
  badgeLabel: string;
  title: string;
  description: string;
  footerPrimary: string;
  footerSecondary: string;
  navItems: readonly DashboardNavItem[];
};

export const ADMIN_SIDEBAR_CONFIG: DashboardSidebarConfig = {
  badgeLabel: "Administrator",
  title: "Panel OSK",
  description: "Zarządzaj ośrodkiem szkolenia",
  footerPrimary: "© 2026 OSK Józef Majkut",
  footerSecondary: "Leżajsk, woj. podkarpackie",
  navItems: [
    { href: "/administrator", label: "Dashboard", icon: "grid" },
    { href: "/administrator/kursanci", label: "Kursanci", icon: "users" },
    {
      href: "/administrator/instruktorzy",
      label: "Instruktorzy",
      icon: "academic-cap",
    },
    { href: "/administrator/kursy", label: "Kursy", icon: "car" },
    {
      href: "/administrator/ogloszenia",
      label: "Ogłoszenia",
      icon: "megaphone",
    },
  ],
};

export const KURSANT_SIDEBAR_CONFIG: DashboardSidebarConfig = {
  badgeLabel: "Kursant",
  title: "Twój Panel",
  description: "Śledź postępy i nauke",
  footerPrimary: "© 2026 OSK Józef Majkut",
  footerSecondary: "Leżajsk, woj. podkarpackie",
  navItems: [
    { href: "/kursant", label: "Panel główny", icon: "grid" },
    { href: "/kursant/wyklady", label: "Wykłady", icon: "book-open" },
    { href: "/kursant/instruktorzy", label: "Instruktorzy", icon: "users" },
    { href: "/kursant/jazdy", label: "Jazdy praktyczne", icon: "ticket" },
    {
      href: "/kursant/materialy",
      label: "Materiały do nauki",
      icon: "academic-cap",
    },
  ],
};

export const INSTRUKTOR_SIDEBAR_CONFIG: DashboardSidebarConfig = {
  badgeLabel: "Instruktor",
  title: "Panel Instruktora",
  description: "Prowadz kursantow i jazdy",
  footerPrimary: "© 2026 OSK Jozef Majkut",
  footerSecondary: "Lezajsk, woj. podkarpackie",
  navItems: [
    { href: "/instruktor", label: "Dashboard", icon: "grid" },
    { href: "/instruktor/kursanci", label: "Moi kursanci", icon: "users" },
    { href: "/instruktor/jazdy", label: "Moj harmonogram", icon: "car" },
  ],
};
