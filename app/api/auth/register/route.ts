import { prisma } from "@/lib/prisma";
import {
  registerOwnerSchema,
  registerUserSchema,
} from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { role } = body;
    // Pick schema based on role — Zod handles ALL validation
    const schema =
      role === "PHARMACY_OWNER" ? registerOwnerSchema : registerUserSchema;

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      // Get first error message from Zod
      const firstError = parsed.error.issues[0];
      return NextResponse.json({ error: firstError.message }, { status: 400 });
    }
    // parsed.data is now fully typed and validated
    const data = parsed.data;

    // --- Check if email already exists ---
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
        // 409 = Conflict — resource already exists
      );
    }

    // --- Hash password ---
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // --- Create user ---
    // Transaction — all DB operations succeed or all fail together
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: role === "PHARMACY_OWNER" ? "PHARMACY_OWNER" : "USER",
        },
      });

      // Only create pharmacy if registering as owner
      if (role === "PHARMACY_OWNER") {
        const ownerData = data as typeof data & {
          pharmacyName: string;
          pharmacyEmail: string;
          pharmacyPhone: string;
          pharmacyAddress: string;
          pharmacyLat: number;
          pharmacyLng: number;
        };

        const pharmacy = await tx.pharmacy.create({
          data: {
            name: ownerData.pharmacyName,
            email: ownerData.pharmacyEmail,
            phone: ownerData.pharmacyPhone,
            address: ownerData.pharmacyAddress,
            lat: ownerData.pharmacyLat,
            lng: ownerData.pharmacyLng,
            isOpen: true,
          },
        });

        await tx.pharmacyOwner.create({
          data: {
            userId: newUser.id,
            pharmacyId: pharmacy.id,
          },
        });
      }

      return newUser;
    });

    // Never send password back — even hashed
    return NextResponse.json(
      {
        message: "Account created successfully",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 },
      // 201 = Created — resource was successfully created
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
