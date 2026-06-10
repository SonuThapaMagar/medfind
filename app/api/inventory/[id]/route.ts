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
  const { quantity, price } = body;
  if (quantity === undefined || price === undefined) {
    return NextResponse.json(
      {
        error: "Quantity and price are required",
      },
      { status: 400 },
    );
  }

  // Verify this inventory item belongs to this owner
  // Security: owners should only edit THEIR inventory
  const pharmacyOwner = await prisma.pharmacyOwner.findUnique({
    where: { userId: session.user.id },
  });

  if (!pharmacyOwner) {
    return NextResponse.json({ error: "No pharmacy found" }, { status: 404 });
  }

  const inventoryItem = await prisma.inventory.findUnique({
    where: { id },
  });

  if (!inventoryItem || inventoryItem.pharmacyId !== pharmacyOwner.pharmacyId) {
    // Either doesn't exist OR belongs to a different pharmacy
    return NextResponse.json(
      { error: "Not found or not authorized" },
      { status: 403 },
      // 403 = Forbidden — you're authenticated but not allowed
    );
  }

  const updated = await prisma.inventory.update({
    where: { id },
    data: {
      quantity: Number(quantity),
      price: Number(price),
    },
    include: { medicine: true },
  });
  return NextResponse.json(updated);
}
