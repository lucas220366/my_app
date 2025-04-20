"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Loader, Lock, Mail, ShieldCheck } from "lucide-react";
import useAdminAuthStore from "@/store/useAdminAuthStore";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const formControls = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
};

const AdminLoginPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading, error, clearError, getCsrfToken } =
    useAdminAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      });
      clearError();
    }
  }, [error, toast, clearError]);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email address",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (errors.email) {
      toast({
        title: "Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get CSRF token before login attempt
      // const csrfToken = await getCsrfToken();
      // if (!csrfToken) {
      //   toast({
      //     title: "Error",
      //     description: "Failed to initialize security token. Please try again.",
      //     variant: "destructive",
      //   });
      //   return;
      // }

      await login(formData.email, formData.password);
    } catch (error) {
      // Error is already handled by the store and useEffect
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F9FC] p-4">
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C8E6C9] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#4CAF50] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <motion.div
        className="w-full max-w-md rounded-xl bg-white p-6 sm:p-8 shadow-xl border border-[#C8E6C9] relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="w-16 h-16 rounded-full bg-[#E8F5E9] flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-[#4CAF50]" />
          </div>
        </motion.div>

        <motion.div
          className="space-y-2 text-center mb-8"
          variants={formControls}
          custom={0}
        >
          <h2 className="text-2xl font-bold text-[#2E7D32]">Admin Portal</h2>
          <p className="text-sm text-gray-600">
            Secure access to the administration dashboard
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <motion.div variants={formControls} custom={1} className="space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-[#2E7D32] ml-1 flex items-center"
            >
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Email
            </label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                placeholder="admin@example.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`border-[#C8E6C9] focus:border-[#4CAF50] focus:ring-[#81C784] pl-3 pr-10 py-2 h-11 ${
                  errors.email
                    ? "border-red-500"
                    : formData.email && !errors.email
                    ? "border-[#4CAF50]"
                    : ""
                }`}
              />
              {formData.email && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  {errors.email ? (
                    <X className="h-5 w-5 text-red-500" />
                  ) : (
                    <Check className="h-5 w-5 text-[#4CAF50]" />
                  )}
                </div>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 ml-1">{errors.email}</p>
            )}
          </motion.div>

          <motion.div variants={formControls} custom={2} className="space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-[#2E7D32] ml-1 flex items-center"
            >
              <Lock className="h-3.5 w-3.5 mr-1.5" />
              Password
            </label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="border-[#C8E6C9] focus:border-[#4CAF50] focus:ring-[#81C784] pl-3 py-2 h-11"
            />
          </motion.div>

          <motion.div variants={formControls} custom={3} className="pt-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                className="w-full bg-[#4CAF50] hover:bg-[#2E7D32] text-white h-11 font-medium"
                type="submit"
                disabled={isLoading || !!errors.email}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </div>
                ) : (
                  "Sign in to Admin"
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 pt-4 border-t border-[#E8F5E9] text-center"
        >
          <p className="text-xs text-gray-500">
            This is a secure area. Only authorized personnel should attempt to
            log in.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;

