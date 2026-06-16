import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function PharmacyOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  // Only PHARMACY_OWNER can access /pharmacyOwner routes
  if (session.user.role !== "PHARMACY_OWNER") redirect("/");

  const pharmacyOwner = await prisma.pharmacyOwner.findUnique({
    where: { userId: session.user.id },
    include: { pharmacy: true },
  });

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        name={pharmacyOwner?.pharmacy.name ?? "My Pharmacy"}
        email={session.user.email ?? ""}
        role="PHARMACY_OWNER"
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
