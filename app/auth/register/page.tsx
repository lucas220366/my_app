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

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, isAuthenticated, isLoading, error, clearError } =
    useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const validateName = (name: string) => {
    return name.length >= 2;
  };

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string
  ) => {
    return password === confirmPassword;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "fullName") {
      setErrors((prev) => ({
        ...prev,
        fullName: validateName(value)
          ? ""
          : "Name must be at least 2 characters long",
      }));
    } else if (name === "email") {
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
        confirmPassword: validateConfirmPassword(
          value,
          formData.confirmPassword
        )
          ? ""
          : "Passwords do not match",
      }));
    } else if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(formData.password, value)
          ? ""
          : "Passwords do not match",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      errors.fullName ||
      errors.email ||
      errors.password ||
      errors.confirmPassword ||
      !formData.agreeTerms
    ) {
      toast({
        title: "Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(formData.email, formData.password, formData.fullName);
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
                  Empower Your Local Business with AI
                </h1>
                <p className="mt-2 text-[#4CAF50]/80">
                  Build custom AI chatbots to provide 24/7 customer support,
                  boost engagement, and grow your local business—all without any
                  technical expertise.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Registration Form */}
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
                  Create your Account
                </h2>
                <p className="text-sm text-text-secondary">
                  Start your journey with us today
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <motion.div
                  variants={formControls}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                >
                  <div className="relative">
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="Full Name"
                      type="text"
                      autoCapitalize="words"
                      autoComplete="name"
                      autoCorrect="off"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className={`border-text-secondary focus:border-[#4CAF50] pr-10 ${
                        errors.fullName
                          ? "border-red-500"
                          : formData.fullName && !errors.fullName
                          ? "border-[#4CAF50]"
                          : ""
                      }`}
                    />
                    {formData.fullName && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {errors.fullName ? (
                          <X className="h-5 w-5 text-red-500" />
                        ) : (
                          <Check className="h-5 w-5 text-[#4CAF50]" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.fullName}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  variants={formControls}
                  initial="hidden"
                  animate="visible"
                  custom={2}
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
                  custom={3}
                >
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      placeholder="Password"
                      type="password"
                      autoComplete="new-password"
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
                  variants={formControls}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className={`border-text-secondary focus:border-[#4CAF50] pr-10 ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : formData.confirmPassword && !errors.confirmPassword
                          ? "border-[#4CAF50]"
                          : ""
                      }`}
                    />
                    {formData.confirmPassword && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        {errors.confirmPassword ? (
                          <X className="h-5 w-5 text-red-500" />
                        ) : (
                          <Check className="h-5 w-5 text-[#4CAF50]" />
                        )}
                      </div>
                    )}
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  className="flex items-center space-x-2"
                  variants={formControls}
                  initial="hidden"
                  animate="visible"
                  custom={5}
                >
                  <Checkbox
                    id="terms"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        agreeTerms: checked as boolean,
                      }))
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text-primary"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#4CAF50] hover:underline"
                    >
                      terms and conditions
                    </Link>
                  </label>
                </motion.div>

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
                        isLoading ||
                        !!errors.fullName ||
                        !!errors.email ||
                        !!errors.password ||
                        !!errors.confirmPassword ||
                        !formData.agreeTerms
                      }
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <Loader className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </div>
                      ) : (
                        "Register"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {error && (
                  <motion.p
                    className="text-center text-red-500 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </form>

              <motion.div
                className="text-center text-sm"
                variants={formControls}
                initial="hidden"
                animate="visible"
                custom={7}
              >
                Already have an account?{" "}
                <Link href="/auth" className="text-[#4CAF50] hover:underline">
                  Log in
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

