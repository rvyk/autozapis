import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "CLERK_SECRET_KEY_MISSING" }, { status: 500 });
  }

  await prisma.user.deleteMany({
    where: { clerkId: userId },
  });

  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ error: "CLERK_DELETE_FAILED" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
