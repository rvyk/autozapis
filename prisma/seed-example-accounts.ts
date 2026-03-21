import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

type DemoAccount = {
  key: "admin" | "instructor" | "student";
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "ADMINISTRATOR" | "INSTRUKTOR" | "USER";
  phoneNumber: string;
  trainingCategory: "B";
  isAccountActive: boolean;
  isRegistrationComplete: boolean;
  birthDate: string;
};

type ClerkUser = {
  id: string;
};

type ClerkUsersResponse = ClerkUser[];

type ClerkErrorResponse = {
  errors?: Array<{ message?: string; code?: string; long_message?: string }>;
};

const connectionString = process.env["DATABASE_URL"];

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const clerkSecretKey = process.env["CLERK_SECRET_KEY"];

if (!clerkSecretKey) {
  throw new Error("CLERK_SECRET_KEY is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const demoAccounts: DemoAccount[] = [
  {
    key: "admin",
    email: "demo.admin@autozapis-demo.pl",
    password: "Admin123!",
    firstName: "Demo",
    lastName: "Administrator",
    role: "ADMINISTRATOR",
    phoneNumber: "724545383",
    trainingCategory: "B",
    isAccountActive: true,
    isRegistrationComplete: true,
    birthDate: "1990-04-15",
  },
  {
    key: "instructor",
    email: "demo.instruktor@autozapis-demo.pl",
    password: "Instruktor123!",
    firstName: "Demo",
    lastName: "Instruktor",
    role: "INSTRUKTOR",
    phoneNumber: "661420887",
    trainingCategory: "B",
    isAccountActive: true,
    isRegistrationComplete: true,
    birthDate: "1988-09-22",
  },
  {
    key: "student",
    email: "demo.kursant@autozapis-demo.pl",
    password: "Kursant123!",
    firstName: "Demo",
    lastName: "Kursant",
    role: "USER",
    phoneNumber: "600100200",
    trainingCategory: "B",
    isAccountActive: true,
    isRegistrationComplete: true,
    birthDate: "2001-01-10",
  },
];

async function clerkRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`https://api.clerk.com/v1${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${clerkSecretKey}`,
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const detailsText = await response.text().catch(() => "");
    let details = detailsText;
    try {
      const parsed = JSON.parse(detailsText) as ClerkErrorResponse;
      const first = parsed.errors?.[0];
      if (first) {
        details = first.long_message || first.message || detailsText;
      }
    } catch {
      // keep raw details text
    }
    throw new Error(
      `Clerk API ${init.method ?? "GET"} ${path} failed (${response.status}): ${details}`,
    );
  }

  return (await response.json()) as T;
}

async function findClerkUserByEmail(email: string) {
  const users = await clerkRequest<
    Array<{ id: string; email_addresses?: Array<{ email_address: string }> }>
  >("/users?limit=100", { method: "GET" });

  return (
    users.find((user) =>
      (user.email_addresses ?? []).some((item) => item.email_address === email),
    ) ?? null
  );
}

async function createClerkUser(account: DemoAccount) {
  try {
    return await clerkRequest<ClerkUser>(
      "/users",
      {
        method: "POST",
        body: JSON.stringify({
          email_address: [account.email],
          password: account.password,
          first_name: account.firstName,
          last_name: account.lastName,
          skip_password_checks: true,
        }),
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const isPasswordPolicyError =
      message.includes("password") || message.includes("Password");

    if (!isPasswordPolicyError) {
      throw error;
    }

    console.warn(
      `Hasło dla ${account.email} nie przeszło polityki Clerk. Tworzę konto z fallback hasłem.`,
    );

    return await clerkRequest<ClerkUser>(
      "/users",
      {
        method: "POST",
        body: JSON.stringify({
          email_address: [account.email],
          password: "DemoPass123!",
          first_name: account.firstName,
          last_name: account.lastName,
          skip_password_checks: true,
        }),
      },
    );
  }
}

async function main() {
  for (const account of demoAccounts) {
    let clerkUser = await findClerkUserByEmail(account.email);

    if (!clerkUser) {
      clerkUser = await createClerkUser(account);
    }

    const existingWithClerkId = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { email: true },
    });

    if (
      existingWithClerkId?.email &&
      existingWithClerkId.email !== account.email
    ) {
      console.warn(
        `Pomijam ${account.email}: clerkId ${clerkUser.id} jest przypisany do ${existingWithClerkId.email}.`,
      );
      continue;
    }

    await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      create: {
        clerkId: clerkUser.id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        phoneNumber: account.phoneNumber,
        role: account.role,
        trainingCategory: account.trainingCategory,
        isAccountActive: account.isAccountActive,
        isRegistrationComplete: account.isRegistrationComplete,
        birthDate: new Date(account.birthDate),
      },
      update: {
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        phoneNumber: account.phoneNumber,
        role: account.role,
        trainingCategory: account.trainingCategory,
        isAccountActive: account.isAccountActive,
        isRegistrationComplete: account.isRegistrationComplete,
        birthDate: new Date(account.birthDate),
      },
    });

    console.log(
      `Demo account ready: ${account.key} (${account.email}) / ${account.password}`,
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
