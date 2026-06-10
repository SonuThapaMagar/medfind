import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  // Verify ownership before allowing update
  const pharmacyOwner = await prisma.pharmacyOwner.findUnique({
    where: { userId: session.user.id },
  });

  if (!pharmacyOwner || pharmacyOwner.pharmacyId !== id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const updated = await prisma.pharmacy.update({
    where: { id },
    data: body,
    // body can contain: { isOpen: true/false } or other fields
  });

  return NextResponse.json(updated);
}
