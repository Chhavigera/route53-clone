"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { getCurrentUser, logout, User } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("route53_token");

      if (!token) {
        setUser(null);
        setLoading(false);

        if (pathname !== "/login") {
          router.replace("/login");
        }

        return;
      }

      try {
        const currentUser = await getCurrentUser(token);

        setUser(currentUser);

        localStorage.setItem(
          "route53_user",
          JSON.stringify(currentUser)
        );

        if (pathname === "/login") {
          router.replace("/");
        }
      } catch {
        localStorage.removeItem("route53_token");
        localStorage.removeItem("route53_user");

        setUser(null);

        if (pathname !== "/login") {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, [pathname, router]);

  async function logoutUser() {
    const token = localStorage.getItem("route53_token");

    try {
      if (token) {
        await logout(token);
      }
    } catch {
      // Clear local session even if the backend request fails.
    } finally {
      localStorage.removeItem("route53_token");
      localStorage.removeItem("route53_user");

      setUser(null);
      router.replace("/login");
    }
  }

  if (loading && pathname !== "/login") {
    return (
      <main className="min-h-screen bg-[#f7f8fa] flex items-center justify-center">
        <div className="rounded-lg border border-gray-300 bg-white px-8 py-6">
          <p className="text-sm text-gray-700">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}
