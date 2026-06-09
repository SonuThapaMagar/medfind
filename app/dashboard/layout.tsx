// app/dashboard/layout.tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "PHARMACY" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 gap-4">
        <p className="text-lg font-semibold">Pharmacy Dashboard</p>
        <p className="text-sm text-gray-400">{session.user.email}</p>

        <nav className="flex flex-col gap-2 mt-6">
          <Link
            href="/dashboard"
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            Overview
          </Link>
          <Link
            href="/dashboard/inventory"
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            Inventory
          </Link>
          <Link
            href="/dashboard/profile"
            className="hover:bg-gray-700 px-3 py-2 rounded"
          >
            Pharmacy Profile
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
