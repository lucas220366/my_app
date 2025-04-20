"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Mail, ArrowRight } from "lucide-react";
import useForgotStore from "@/store/useForgotStore";

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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const { loading, success, requestPasswordReset, clearState } =
    useForgotStore();

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      await requestPasswordReset(email);

      toast({
        title: "Reset link sent",
        description: "Please check your email for password reset instructions.",
      });

      // Optionally, redirect to login page after a delay
      setTimeout(() => {
        clearState();
        router.push(`/auth/change-password?email=${encodeURIComponent(email)}`);
      }, 5000);
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
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
            <div className="absolute inset-0 bg-primary/10" />
            <div className="relative h-full p-12">
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Image
                  src="https://res.cloudinary.com/doaxoti6i/image/upload/v1740072191/Forgot_password-bro_brbudq.png"
                  alt="Forgot Password Illustration"
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
                <h1 className="text-3xl font-bold text-primary">
                  Forgot Your Password?
                </h1>
                <p className="mt-2 text-primary/80">
                  Don't worry, it happens. Let's get you back into your account.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Forgot Password Form */}
          <div className="flex items-center p-8 lg:p-12">
            <div className="mx-auto max-w-md space-y-8 w-full">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    <motion.div
                      className="space-y-2 text-center"
                      variants={formControls}
                      initial="hidden"
                      animate="visible"
                      custom={0}
                    >
                      <h2 className="text-2xl font-semibold tracking-tight text-text-primary">
                        Reset Your Password
                      </h2>
                      <p className="text-sm text-text-secondary">
                        Enter your email address and we'll send you a link to
                        reset your password.
                      </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <motion.div
                        variants={formControls}
                        initial="hidden"
                        animate="visible"
                        custom={1}
                      >
                        <Label htmlFor="email" className="text-text-primary">
                          Email
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value);
                              setError("");
                            }}
                            required
                            className={`border-slate-200 focus:border-primary pr-10 ${
                              error
                                ? "border-red-500"
                                : email && !error
                                ? "border-green-500"
                                : ""
                            }`}
                          />
                          {email && (
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              {error ? (
                                <X className="h-5 w-5 text-red-500" />
                              ) : (
                                <Check className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          )}
                        </div>
                        {error && (
                          <p className="mt-1 text-xs text-red-500">{error}</p>
                        )}
                      </motion.div>
                      <motion.div
                        variants={formControls}
                        initial="hidden"
                        animate="visible"
                        custom={2}
                      >
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                          disabled={loading}
                        >
                          {loading ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </motion.div>
                    </form>

                    <motion.div
                      className="text-center text-sm"
                      variants={formControls}
                      initial="hidden"
                      animate="visible"
                      custom={3}
                    >
                      Remember your password?{" "}
                      <Link
                        href="/auth"
                        className="text-primary hover:underline"
                      >
                        Log in
                      </Link>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                        damping: 10,
                      }}
                    >
                      <div className="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                        <Mail className="h-12 w-12 text-green-600" />
                      </div>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-primary-dark">
                      Check Your Inbox
                    </h2>
                    <p className="text-text-secondary">
                      We've sent a password reset link to{" "}
                      <strong>{email}</strong>. Please check your email and
                      follow the instructions to reset your password.
                    </p>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 1.5 }}
                      className="h-1 bg-primary mx-auto"
                    />
                    <p className="text-sm text-text-secondary">
                      Didn't receive the email? Check your spam folder or try
                      again.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={() => router.push("/auth")}
                        className="mt-4 bg-primary hover:bg-primary/90 text-white"
                      >
                        Return to Login <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

