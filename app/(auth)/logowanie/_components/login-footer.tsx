import Link from "next/link";
import { AuthCardFooter } from "@/components/auth";

export function LoginFooter() {
  return (
    <AuthCardFooter>
      Nie masz konta?{" "}
      <Link
        href="/rejestracja"
        className="font-semibold text-red-700 underline-offset-4 transition-colors hover:text-red-800 hover:underline"
      >
        Zarejestruj się
      </Link>
    </AuthCardFooter>
  );
}
