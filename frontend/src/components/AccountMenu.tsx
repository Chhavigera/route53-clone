"use client";

import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/components/AuthProvider";

export default function AccountMenu() {
  const { user, logoutUser } = useAuth();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-gray-100"
      >
        <div>
          <p className="text-sm font-medium text-gray-900">
            {user?.name || "User"}
          </p>

          <p className="text-xs text-gray-600">
            {user?.email || ""}
          </p>
        </div>

        <span
          className={`text-xs text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
          <div className="border-b border-gray-200 px-4 py-4">
            <p className="text-sm font-semibold text-gray-900">
              {user?.name || "User"}
            </p>

            <p className="mt-1 break-all text-xs text-gray-600">
              {user?.email || ""}
            </p>
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={logoutUser}
              className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}