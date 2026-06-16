"use client";

import Pagination from "@/components/ui/Pagination";
import { Users } from "@/types/index.type";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminUserMgmtPage() {
  const [users, setUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("/api/admin/users");
      const data = await response.json();
      setUsers(data);
      setIsLoading(false);
    }
    fetchUsers();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );

  // --- PAGINATION LOGIC ---
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  return (
    <div>
      <h1 className="text-lg font-medium text-gray-900 mb-6">
        Users ({users.length})
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                S.N
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Name
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Email
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Role
              </th>
              <th className="text-left text-xs text-gray-400 font-medium px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u, index) => {
              const serialNumber = indexOfFirstUser + index + 1;
              return (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500">{serialNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">
                      {u.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.role}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="flex gap-4">
                      <button className="text-primary hover:text-primar/90 font-medium cursor-pointer">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="text-danger hover:text-danger/90 font-medium cursor-pointer">
                        <Trash className="w-4 h-4" />
                      </button>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* --- PAGINATION UI CONTROLS --- */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={users.length}
          indexOfFirstItem={indexOfFirstUser}
          indexOfLastItem={indexOfLastUser}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
