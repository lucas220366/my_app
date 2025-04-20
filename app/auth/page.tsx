"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Loader } from "lucide-react";
import useAuthStore from "@/store/useAuthStore";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
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

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, isAuthenticated, isLoading, error, clearError, user } =
    useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    console.log("Auth state changed:", { isAuthenticated, user });
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      console.log("Redirecting to dashboard...");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, user]);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email address",
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters long",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate fields
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    if (errors.email || errors.password) {
      toast({
        title: "Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await login(formData.email, formData.password);
      // Redirect will happen automatically due to the useEffect
    } catch (error) {
      // Error is handled by the store and displayed via useEffect
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        className="relative w-full max-w-6xl overflow-hidden rounded-2xl bg-background-white shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid lg:grid-cols-2">
          {/* Left Column - Image */}
          <motion.div
            className="relative hidden lg:block"
            variants={childVariants}
          >
            <div className="absolute inset-0 bg-[#4CAF50]/10" />
            <div className="relative h-full p-12">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src="https://www.cavisson.com/wp-content/uploads/2023/05/innovation-creativity-or-imagination-for-business-success-illustration-png.png"
                  alt="Decorative illustration"
                  width={500}
                  height={500}
                  className="mx-auto"
                />
              </motion.div>
              <motion.div
                className="mt-8 text-center"
                variants={childVariants}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl font-bold text-[#4CAF50]">
                  AI-Powered Chatbots for Local Businesses
                </h1>
                <p className="mt-2 text-[#4CAF50]/80">
                  Create intelligent, personalized chatbots to enhance customer
                  engagement and streamline your local business operations—no
                  coding required.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Login Form */}
          <div className="p-8 lg:p-12">
            <div className="mx-auto max-w-md space-y-8">
              <motion.div
                className="space-y-2 text-center"
                variants={formControls}
                initial="hidden"
                animate="visible"
                custom={0}
              >
                <div className="flex justify-center">
                  <div className="h-12 w-12 text-[#4CAF50]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                  Login to your Account
                </h2>
                <p className="text-sm text-text-secondary">
                  Access your personalized AI-powered chatbots
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <motion.div
                  variants={formControls}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                >
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      placeholder="Email"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={`border-text-secondary focus:border-[#4CAF50] pr-10 ${
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
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </motion.div>

                <motion.div
                  variants={formControls}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className={`border-text-secondary focus:border-[#4CAF50] pr-10 ${
                        errors.password
                          ? "border-red-500"
                          : formData.password && !errors.password
                          ? "border-[#4CAF50]"
                          : ""
                      }`}
                    />
                    {formData.password && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {errors.password ? (
                          <X className="h-5 w-5 text-red-500" />
                        ) : (
                          <Check className="h-5 w-5 text-[#4CAF50]" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  className="flex items-center justify-between"
                  variants={formControls}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          rememberMe: checked as boolean,
                        }))
                      }
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-primary"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-[#4CAF50] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </motion.div>

                {error && (
                  <motion.div
                    variants={formControls}
                    initial="hidden"
                    animate="visible"
                    custom={5.5}
                    className="text-center"
                  >
                    <p className="text-red-500 text-sm">{error}</p>
                  </motion.div>
                )}

                <motion.div
                  variants={formControls}
                  initial="hidden"
                  animate="visible"
                  custom={6}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      className="w-full bg-[#4CAF50] hover:bg-[#2E7D32] text-background-white"
                      type="submit"
                      disabled={
                        isLoading || !!errors.email || !!errors.password
                      }
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </div>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>

              <motion.div
                className="text-center text-sm"
                variants={formControls}
                initial="hidden"
                animate="visible"
                custom={7}
              >
                Not Registered Yet?{" "}
                <Link
                  href="/auth/register"
                  className="text-[#4CAF50] hover:underline"
                >
                  Create an account
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

