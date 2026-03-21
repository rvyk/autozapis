import type { Metadata } from "next";
import { AuthAside } from "./_components/auth-aside";
import { AuthBackground } from "./_components/auth-background";
import { AuthContent } from "./_components/auth-content";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-stone-50">
      <AuthBackground />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl flex-col gap-4 px-4 pt-20 pb-6 sm:px-6 sm:pt-24 sm:pb-8 lg:flex-row lg:items-center lg:gap-12 lg:pt-24 lg:pb-10">
        <AuthAside />
        <AuthContent>{children}</AuthContent>
      </div>
    </div>
  );
}
