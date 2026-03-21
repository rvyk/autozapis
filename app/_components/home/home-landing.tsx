"use client";

import { useEffect, useMemo, useState } from "react";
import { HomeHero } from "./home-hero";
import { HomeNavbar } from "./home-navbar";
import {
  HomeCourses,
  HomeFooter,
  HomeInstructors,
  HomePricing,
  HomeTicker,
} from "./home-sections";

const BRAND = "Prawo Jazdy Józef Majkut";
const LOCATIONS = [
  "Grodzisko Górne",
  "Grodzisko Dolne",
  "Żołynia",
  "Leżajsk",
] as const;
const PHONES = ["724 545 383", "661 420 887"] as const;

export function HomeLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("#kursy");
  const [videoSrc, setVideoSrc] = useState("/video2.mp4");

  const videos = useMemo(() => ["/video2.mp4", "/video3.mp4"], []);

  useEffect(() => {
    let lastY = 0;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;
    let showTimer: ReturnType<typeof setTimeout> | null = null;

    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 60);

      if (y > 120) {
        const delta = y - lastY;
        if (delta > 3) {
          if (hideTimer) clearTimeout(hideTimer);
          if (showTimer) clearTimeout(showTimer);
          hideTimer = setTimeout(() => setIsHidden(true), 120);
        } else if (delta < -2) {
          if (hideTimer) clearTimeout(hideTimer);
          if (showTimer) clearTimeout(showTimer);
          setIsHidden(false);
        } else {
          if (showTimer) clearTimeout(showTimer);
          showTimer = setTimeout(() => setIsHidden(false), 180);
        }
      } else {
        if (hideTimer) clearTimeout(hideTimer);
        if (showTimer) clearTimeout(showTimer);
        setIsHidden(false);
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer) clearTimeout(hideTimer);
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    const sectionIds = ["kursy", "instruktorzy", "cennik"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveSection(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVideoSrc((current) => {
        const idx = videos.indexOf(current);
        return videos[(idx + 1) % videos.length];
      });
    }, 9000);

    return () => clearInterval(interval);
  }, [videos]);

  return (
    <main className="bg-[#f2f3f7] text-[#111114]">
      <HomeNavbar
        isScrolled={isScrolled}
        isHidden={isHidden}
        activeSection={activeSection}
        onAnchorNavigate={() => setIsHidden(false)}
      />
      <HomeHero videoSrc={videoSrc} brand={BRAND} locations={LOCATIONS} />
      <HomeTicker />
      <HomeCourses brand={BRAND} />
      <HomeInstructors />
      <HomePricing />
      <HomeFooter brand={BRAND} locations={LOCATIONS} phones={PHONES} />
    </main>
  );
}
