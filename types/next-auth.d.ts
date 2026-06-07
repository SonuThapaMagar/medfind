// This is called "module augmentation" — you're extending
// an existing type from a library without modifying it.
// The "declare module" syntax tells TypeScript:

import { DefaultSession } from "next-auth";

// "add these fields to the existing NextAuth types"
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}