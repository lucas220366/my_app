"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAdminAuthStore from "@/store/useAdminAuthStore";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, refreshAuth } = useAdminAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const isValid = await refreshAuth();
        if (!isValid && pathname !== "/auth/admin") {
          router.push("/auth/admin");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [isAuthenticated, refreshAuth, router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/auth/admin") {
    router.push("/auth/admin");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;

