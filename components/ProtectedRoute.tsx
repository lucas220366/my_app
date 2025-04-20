"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import { Loader } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, fetchUserProfile } = useAuthStore();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!hasCheckedAuth) {
        await fetchUserProfile();
        setHasCheckedAuth(true);
      }
    };

    checkAuth();
  }, [fetchUserProfile, hasCheckedAuth]);

  useEffect(() => {
    if (hasCheckedAuth && !isAuthenticated && !isLoading) {
      router.push("/auth");
    }
  }, [hasCheckedAuth, isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 text-[#4CAF50] animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

