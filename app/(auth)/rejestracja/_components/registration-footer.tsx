import Link from "next/link";
import { AuthCardFooter } from "@/components/auth";

export function RegistrationFooter() {
  return (
    <AuthCardFooter>
      Masz już konto?{" "}
      <Link
        href="/logowanie"
        className="font-semibold text-red-700 underline-offset-4 transition-colors hover:text-red-800 hover:underline"
      >
        Zaloguj się
      </Link>
    </AuthCardFooter>
  );
}
