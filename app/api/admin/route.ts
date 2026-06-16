import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = {
      totalMedicines: 0,
      totalPharmacies: 0,
      totalUsers: 0,
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admin stats" },
      { status: 500 },
    );
  }
}
