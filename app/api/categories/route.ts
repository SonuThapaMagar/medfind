import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.medicine.groupBy({
    by: ["category"],
    where: {
      inventory: {
        some: { quantity: { gt: 0 } },
      },
    },
    orderBy: { category: "asc" },
  });

  const categoryList = categories.map((c) => c.category);
  return NextResponse.json(categoryList);
}
