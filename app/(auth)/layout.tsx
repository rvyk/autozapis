import { AuthAside } from "./_components/auth-aside";
import { AuthBackground } from "./_components/auth-background";
import { AuthContent } from "./_components/auth-content";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-stone-50">
      <AuthBackground />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-7xl items-start gap-0 px-4 py-8 sm:px-6 lg:items-center lg:gap-12 lg:px-8 lg:py-10">
        <AuthAside />
        <AuthContent>{children}</AuthContent>
      </div>
    </div>
  );
}
