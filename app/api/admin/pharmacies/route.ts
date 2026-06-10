import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pharmacies = await prisma.pharmacy.findMany({
    orderBy: { name: "asc" },
    include: {
      owner: {
        include: { user: true },
      },
      _count: { select: { inventory: true } },
    },
  });

  return NextResponse.json(pharmacies);
}
