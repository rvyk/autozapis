import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ kursantId: string }> },
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { role: true },
    });

    if (admin?.role !== "ADMINISTRATOR") {
      return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    }

    const { kursantId } = await params;
    const body = await request.json();

    const coursePrice = Number(body.coursePrice);
    const amountPaid = Number(body.amountPaid);

    if (isNaN(coursePrice) || isNaN(amountPaid) || coursePrice < 0 || amountPaid < 0) {
      return NextResponse.json({ error: "INVALID_INPUT" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: kursantId },
      data: {
        coursePrice,
        amountPaid,
      },
    });

    return NextResponse.json({ success: true, kursantId: updatedUser.id });
  } catch (error) {
    console.error("[KURSANT_PAYMENT_UPDATE]", error);
    return NextResponse.json({ error: "UPDATE_FAILED" }, { status: 500 });
  }
}
