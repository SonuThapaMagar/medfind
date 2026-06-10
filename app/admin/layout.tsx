import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <>
      <div className="flex min-h-screen">
        <aside className="w-56 bg-gray-950 text-white flex flex-col p-5 gap-4 shrink-0">
          <div>
            <p className="text-sm font-medium text-white">MedFind Nepal</p>
            <p className="text-xs text-gray-500 mt-0.5">Admin panel</p>
          </div>

          <nav className="flex flex-col gap-1 mt-4">
            <Link
              href="/admin"
              className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/admin/medicines"
              className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
            >
              Medicines
            </Link>
            <Link
              href="/admin/pharmacies"
              className="text-sm text-gray-400 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
            >
              Pharmacies
            </Link>
          </nav>

          <div className="mt-auto">
            <p className="text-xs text-gray-600">{session.user.email}</p>
          </div>
        </aside>

        <main className="flex-1 bg-gray-50 p-8">{children}</main>
      </div>
    </>
  );
}
