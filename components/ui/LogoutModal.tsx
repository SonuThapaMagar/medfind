import { LogOut, X } from "lucide-react";
import { signOut } from "next-auth/react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}
export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/*Modal */}
      <div
        className="fixed
        z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xs md:max-w-sm
        bg-white rounded-xl shadow-xl p-6"
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
          <LogOut size={22} className="text-red-500" />
        </div>

        {/* Text */}
        <h2 className="text-center text-sm md:text-base font-semibold text-gray-900 mb-1">
          Log out?
        </h2>
        <p className="text-center text-xs md:text-sm text-gray-500 mb-6">
          Are you sure you want to log out of your account?
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 text-xs md:text-sm rounded-lg border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex-1 h-10 text-xs md:text-sm rounded-lg bg-red-500 font-medium text-white hover:bg-red-600 transition-colors cursor-pointer"
          >
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
