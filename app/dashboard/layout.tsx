import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Sidebar } from "@/components/layout/Sidebar";
import { prisma } from "@/lib/prisma";

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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        pharmacyName={pharmacyOwner?.pharmacy.name ?? "My Pharmacy"}
        email={session.user.email}
      />
      <main
        className="dashboard-main"
        style={{
          flex: 1,
          padding: "2rem",
          background: "var(--color-bg)",
          minWidth: 0,
        }}
      >
        {" "}
        {children}
      </main>
    </div>
  );
}
