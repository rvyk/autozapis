import { prisma } from "@/lib/prisma";
import { KursanciPageContent } from "./_components/kursanci-page-content";
import type {
  KursantListItem,
  KursantStatusFilter,
} from "./_components/kursanci-types";

function normalizeFilter(value: string | string[] | undefined): KursantStatusFilter {
  if (typeof value !== "string") {
    return "WSZYSCY";
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === "oczekujacy") return "OCZEKUJACY";
  if (normalized === "aktywny") return "AKTYWNY";
  if (normalized === "brak-pkk") return "BRAK_PKK";

  return "WSZYSCY";
}

function mapKursantStatus(kursant: {
  isAccountActive: boolean;
  isRegistrationComplete: boolean;
  pkkFile: { id: string } | null;
}): Exclude<KursantStatusFilter, "WSZYSCY"> {
  if (!kursant.pkkFile || !kursant.isRegistrationComplete) {
    return "BRAK_PKK";
  }

  if (kursant.isAccountActive) {
    return "AKTYWNY";
  }

  return "OCZEKUJACY";
}

export default async function KursanciPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[] }>;
}) {
  const params = await searchParams;

  const dbKursanci = await prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
      isAccountActive: true,
      isRegistrationComplete: true,
      trainingCategory: true,
      coursePrice: true,
      amountPaid: true,
      pkkFile: {
        select: {
          id: true,
          originalFileName: true,
          uploadedAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const kursanci: KursantListItem[] = dbKursanci.map((kursant) => {
    const fullName = [kursant.firstName, kursant.lastName]
      .filter((part) => typeof part === "string" && part.trim().length > 0)
      .join(" ")
      .trim();

    return {
      id: kursant.id,
      fullName: fullName || "Brak danych",
      email: kursant.email ?? "Brak e-mail",
      registeredAt: kursant.createdAt.toISOString(),
      trainingCategory: kursant.trainingCategory,
      coursePrice: kursant.coursePrice,
      amountPaid: kursant.amountPaid,
      status: mapKursantStatus(kursant),
      pkkFile: kursant.pkkFile
        ? {
            originalFileName: kursant.pkkFile.originalFileName,
            uploadedAt: kursant.pkkFile.uploadedAt.toISOString(),
          }
        : null,
    };
  });

  const initialFilter = normalizeFilter(params.status);

  return (
    <KursanciPageContent
      initialKursanci={kursanci}
      initialFilter={initialFilter}
    />
  );
}
