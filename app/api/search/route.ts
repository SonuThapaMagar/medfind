import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  // If no search term, return empty — don't query the whole DB
  if (!q.trim()) {
    return NextResponse.json([]);
  }

  // Find inventory records where the medicine name matches
  // This is the key query — it crosses three tables:
  // Inventory → Medicine (for the search match)
  // Inventory → Pharmacy (for location + contact info)
  const results = await prisma.inventory.findMany({
    where: {
      medicine: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { genericName: { contains: q, mode: "insensitive" } },
        ],
      },
      // gt: 0 means "greater than 0" — only show pharmacies with stock
      quantity: { gt: 0 },
    },
    include: {
      medicine: true,
      pharmacy: true,
    },
    orderBy: {
      price: "asc",
    },
  });
  return NextResponse.json(results);
}
