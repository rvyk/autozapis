"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface NavigateOptions {
  session?: {
    currentTask?: unknown;
  };
  decorateUrl: (url: string) => string;
}

/**
 * Hook do obsługi nawigacji po pomyślnym zalogowaniu/rejestracji.
 * Obsługuje dekorowanie URL przez Clerk i przekierowania.
 */
export function useAuthNavigation() {
  const router = useRouter();

  const navigate = useCallback(
    (redirectTo: string = "/") => {
      return ({ session, decorateUrl }: NavigateOptions) => {
        if (session?.currentTask) {
          console.log("Session has current task:", session.currentTask);
          return;
        }

        const url = decorateUrl(redirectTo);
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      };
    },
    [router]
  );

  return { navigate };
}
