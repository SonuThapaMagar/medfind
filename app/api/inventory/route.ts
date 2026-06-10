import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // Get the session — this tells us who is making the request
  const session = await getServerSession(authOptions);
  console.log("inventory GET - session:", JSON.stringify(session));

  if (!session) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }
  console.log("inventory GET - looking for userId:", session.user.id);
  // Find this owner's pharmacy
  const pharmacyOwner = await prisma.pharmacyOwner.findUnique({
    where: { userId: session.user.id },
    include: {
      pharmacy: {
        include: {
          inventory: {
            include: {
              medicine: true,
            },
            orderBy: {
              medicine: { name: "asc" },
            },
          },
        },
      },
    },
  });
  console.log(
    "inventory GET - pharmacyOwner found:",
    JSON.stringify(pharmacyOwner),
  );

  if (!pharmacyOwner) {
    return NextResponse.json(
      { error: "No pharmacy found for this account" },
      { status: 404 },
    );
  }

  return NextResponse.json(pharmacyOwner.pharmacy);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        error: "Not Authenticated",
      },
      { status: 401 },
    );
  }

  const body = await request.json();
  const { medicineId, quantity, price } = body;
  // Validate
  if (!medicineId || quantity === undefined || price === undefined) {
    return NextResponse.json(
      {
        error: "MedicineId, quantity and price are required",
      },
      { status: 400 },
    );
  }

  // Get this owner's pharmacy
  const pharmacyOwner = await prisma.pharmacyOwner.findUnique({
    where: { userId: session.user.id },
  });

  if (!pharmacyOwner) {
    return NextResponse.json(
      { error: "No pharmacy found for this account" },
      { status: 404 },
    );
  }
  // Check if this medicine is already in inventory
  const existing = await prisma.inventory.findFirst({
    where: {
      pharmacyId: pharmacyOwner.pharmacyId,
      medicineId,
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "This medicine is already in your inventory. Edit it instead." },
      { status: 409 },
    );
  }

  const item = await prisma.inventory.create({
    data: {
      pharmacyId: pharmacyOwner.pharmacyId,
      medicineId,
      quantity: Number(quantity),
      price: Number(price),
    },
    include: { medicine: true },
  });

  return NextResponse.json(item, { status: 201 });
}
