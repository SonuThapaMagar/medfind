import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = registerSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { errors: validation.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email and password are required" },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  // --- Check if email already exists ---
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
      // 409 = Conflict — resource already exists
    );
  }

  // --- Hash password ---
  const hashedPassword = await bcrypt.hash(password, 10);

  // --- Create user ---
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER", // new registrations are always USER, not admin
    },
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
}
