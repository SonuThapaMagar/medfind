import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [medicineCount, pharmacyCount, userCount] = await Promise.all([
    prisma.medicine.count(),
    prisma.pharmacy.count(),
    prisma.user.count(),
  ]);

  return (
    <div>
      <h1 className="text-lg font-medium text-gray-900 mb-6">Overview</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">Total medicines</p>
          <p className="text-3xl font-medium text-gray-900">{medicineCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">Total pharmacies</p>
          <p className="text-3xl font-medium text-gray-900">{pharmacyCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs text-gray-400 mb-1">Total users</p>
          <p className="text-3xl font-medium text-gray-900">{userCount}</p>
        </div>
      </div>
    </div>
  );
}
