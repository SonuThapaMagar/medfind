"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { NAV_LINKS } from "@/constants/sidebar.constants";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface SidebarProps {
  email: string | null | undefined;
  pharmacyName: string;
}

export function Sidebar({ email, pharmacyName }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <nav
      className={`
        relative flex flex-col shrink-0
        bg-white border-r border-[var(--color-light-gray)]
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-[250px]" : "w-[72px]"}
      `}
    >
      {/* ── Toggle button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" absolute -right-3 top-8 z-10
    w-6 h-6 rounded-full cursor-pointer
    bg-primary text-white
    flex items-center justify-center
    shadow-md
    hover:bg-[var(--color-secondary)]
    transition-colors duration-200
  "
        aria-label="Toggle sidebar"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      {/* ── Header ── */}
      <div className="flex items-center gap-3 px-4 py-4 h-[72px] overflow-hidden">
        {/* Logo icon */}
        <div
          className="
          w-10 h-10 shrink-0 text-white
          flex items-center justify-center
          text-base font-bold
        "
        >
          <img src="./logo.png" alt="" />
        </div>

        {/* Name + email — hidden when collapsed */}
        <div
          className={`
          flex flex-col overflow-hidden
          transition-all duration-200
          ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
        `}
        >
          <span className="text-sm font-semibold text-[var(--color-text-dark)] truncate">
            {pharmacyName}
          </span>
          <span className="text-[11px] text-[var(--color-muted)] truncate">
            {email}
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-[var(--color-light-gray)] mx-3" />

      {/* ── Nav links ── */}
      <ul className="flex flex-col gap-1 p-3 flex-1 mt-2">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                title={!isOpen ? label : undefined}
                className={`
                  flex items-center gap-3 rounded-lg h-11
                  transition-colors duration-150
                  ${isOpen ? "px-3" : "justify-center px-0"}
                  ${
                    isActive
                      ? "bg-blue-50 text-[var(--color-primary)]"
                      : "text-[var(--color-muted)] hover:bg-[var(--color-card-label)] hover:text-[var(--color-text-dark)]"
                  }
                `}
              >
                <Icon size={20} className="shrink-0" />
                <span
                  className={`
                  text-sm font-medium whitespace-nowrap
                  transition-all duration-200 overflow-hidden
                  ${isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}
                `}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── Bottom: logout ── */}
      <div className="p-3 border-t border-[var(--color-light-gray)]">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          title={!isOpen ? "Logout" : undefined}
          className={`
            w-full flex items-center gap-3 rounded-lg h-11
            text-[var(--color-muted)] hover:bg-red-50 hover:text-red-500
            transition-colors duration-150
            ${isOpen ? "px-3" : "justify-center px-0"}
          `}
        >
          <LogOut size={20} className="shrink-0" />
          <span
            className={`
            text-sm font-medium whitespace-nowrap
            transition-all duration-200 overflow-hidden
            ${isOpen ? "opacity-100 max-w-[200px]" : "opacity-0 max-w-0"}
          `}
          >
            Logout
          </span>
        </button>
      </div>
    </nav>
  );
}
