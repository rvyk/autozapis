import type { Metadata } from "next";
import { LogowaniePageContent } from "./_components/logowanie-page-content";

export const metadata: Metadata = {
  title: "Logowanie",
  description: "Zaloguj się do panelu kursanta, instruktora lub administratora.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LogowaniePage() {
  return <LogowaniePageContent />;
}
