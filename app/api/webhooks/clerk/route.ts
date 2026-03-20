import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function parseBirthDate(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getPrimaryEmail(data: {
  email_addresses?: Array<{ id: string; email_address: string }>;
  primary_email_address_id?: string | null;
}) {
  if (!data.email_addresses || data.email_addresses.length === 0) {
    return null;
  }

  const primary = data.email_addresses.find(
    (address) => address.id === data.primary_email_address_id,
  );

  return (primary ?? data.email_addresses[0])?.email_address ?? null;
}

export async function POST(request: NextRequest) {
  try {
    const event = await verifyWebhook(request);

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const user = event.data;
        const birthDate = parseBirthDate(user.unsafe_metadata?.birthDate);

        await prisma.user.upsert({
          where: { clerkId: user.id },
          create: {
            clerkId: user.id,
            email: getPrimaryEmail(user),
            firstName: user.first_name,
            lastName: user.last_name,
            birthDate,
            imageUrl: user.image_url,
          },
          update: {
            email: getPrimaryEmail(user),
            firstName: user.first_name,
            lastName: user.last_name,
            birthDate,
            imageUrl: user.image_url,
          },
        });

        break;
      }

      case "user.deleted": {
        if (!event.data.id) {
          break;
        }

        await prisma.user.deleteMany({
          where: { clerkId: event.data.id },
        });

        break;
      }

      default:
        break;
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Invalid Clerk webhook", error);
    return new Response("Invalid signature", { status: 400 });
  }
}
