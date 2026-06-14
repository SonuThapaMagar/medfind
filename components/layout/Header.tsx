"use client";

import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  // Simple logic to determine the title based on the path
  const getTitle = () => {
    if (pathname.includes("/inventory")) return "Inventory";
    if (pathname.includes("/returns")) return "Returns";
    return "Dashboard";
  };

  return (
    <header className="h-[64px] border-b border-light-gray bg-white flex items-center px-8">
      <h1 className="text-lg font-semibold text-dark">
        {getTitle()}
      </h1>
    </header>
  );
}
