import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // searchParams reads the query string from the URL
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? ""; // ?? "" means: if null, use empty string instead
  const category = searchParams.get("category") ?? "";

  const medicines = await prisma.medicine.findMany({
    where: {
      AND: [
        //AND means ALL conditions must match
        q // Search by name or genericName
          ? {
              OR: [
                // OR means EITHER condition can match
                { name: { contains: q, mode: "insensitive" } },
                { genericName: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}, // If no search term, {} means no filter — return everything
        // Filter by category if provided
        category ? { category: { equals: category, mode: "insensitive" } } : {},
      ],
    },

    // Also fetch inventory so we know which pharmacies have each medicine
    include: {
      inventory: {
        include: {
          // nested include — inventory → pharmacy details
          pharmacy: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(medicines);
}
