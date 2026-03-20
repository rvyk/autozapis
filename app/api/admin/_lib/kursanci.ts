import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type DbUserRole = "ADMINISTRATOR" | "INSTRUKTOR" | "USER";

export type KursantApiStatus = "AKTYWNY" | "OCZEKUJACY" | "BRAK_PKK";

type AuthenticatedAdmin = {
  id: string;
  role: DbUserRole;
};

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return { error: Response.json({ error: "UNAUTHORIZED" }, { status: 401 }) };
  }

  const prismaDelegates = prisma as unknown as {
    user?: {
      findUnique: (args: {
        where: { clerkId: string };
        select: { id: true; role: true };
      }) => Promise<AuthenticatedAdmin | null>;
    };
  };

  const userDelegate = prismaDelegates.user;

  if (!userDelegate) {
    return {
      error: Response.json(
        {
          error: "PRISMA_CLIENT_OUTDATED",
          detail: "Restart dev server and run prisma generate.",
        },
        { status: 500 },
      ),
    };
  }

  const dbUser = await userDelegate.findUnique({
    where: { clerkId: userId },
    select: { id: true, role: true },
  });

  if (!dbUser || dbUser.role !== "ADMINISTRATOR") {
    return { error: Response.json({ error: "FORBIDDEN" }, { status: 403 }) };
  }

  return { dbUser };
}

export function resolveKursantStatus(input: {
  hasPkkFile: boolean;
  isRegistrationComplete: boolean;
  isAccountActive: boolean;
}): KursantApiStatus {
  if (!input.hasPkkFile || !input.isRegistrationComplete) {
    return "BRAK_PKK";
  }

  if (input.isAccountActive) {
    return "AKTYWNY";
  }

  return "OCZEKUJACY";
}
