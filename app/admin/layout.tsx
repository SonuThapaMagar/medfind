import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  // Only ADMIN can access /admin routes
  if (session.user.role !== "ADMIN") redirect("/");

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        name={admin?.name ?? "Admin"}
        email={session.user.email ?? ""}
        role="ADMIN"
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
