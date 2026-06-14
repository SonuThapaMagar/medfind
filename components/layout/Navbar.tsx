import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="bg-light border-b border-light-gray px-6 h-14 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-10 h-10">
          <img src="./logo.png" alt="MedFind Nepal" />
        </div>
        <span className="text-primary font-secondary font-bold text-xl">
          MedFind
        </span>
      </Link>

      <div className="flex items-center gap-4">
        {session ? (
          <>
            <span className="text-sm text-light hidden sm:block">
              {session.user.name}
            </span>
            {session.user.role === "PHARMACY_OWNER" && (
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
            {session.user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="text-sm text-light transition-colors"
              >
                Admin
              </Link>
            )}
            <button className="bg-secondary w-auto rounded-lg py-1 px-3 text-light hover:bg-secondary/90">
              <Link
                href="/api/auth/signout"
                className="text-sm transition-colors"
              >
                Sign out
              </Link>
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="text-sm font-regular bg-primary hover:bg-secondary text-light px-4 py-1.5 rounded-md transition-colors"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
