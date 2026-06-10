import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session) return null;
  if (session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const medicines = await prisma.medicine.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { inventory: true } },
    },
  });

  return NextResponse.json(medicines);
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { name, genericName, category, unit, description } = body;

  if (!name || !genericName || !category || !unit) {
    return NextResponse.json(
      { error: "name, genericName, category and unit are required" },
      { status: 400 },
    );
  }

  const medicine = await prisma.medicine.create({
    data: { name, genericName, category, unit, description },
  });

  return NextResponse.json(medicine, { status: 201 });
}
