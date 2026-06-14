import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "PHARMACY_OWNER" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  const pharmacyOwner = await prisma.pharmacyOwner.findFirst({
    where: { userId: session.user.id },
    include: { pharmacy: true },
  });

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        pharmacyName={pharmacyOwner?.pharmacy.name ?? "My Pharmacy"}
        email={session.user.email}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 min-w-0"> {children}</main>
      </div>
    </div>
  );
}
