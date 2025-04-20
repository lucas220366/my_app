"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Check, X, Lock, ArrowRight } from "lucide-react";
import useForgotStore from "@/store/useForgotStore";

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

const ChangePasswordContent = () => {
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    resetCode: "",
    password: "",
    confirm: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const email = searchParams.get("email") || "";

  const { loading, success, verifyResetCodeAndUpdatePassword } =
    useForgotStore();

  const validateForm = () => {
    const newErrors = {
      resetCode: "",
      password: "",
      confirm: "",
    };

    if (!resetCode || resetCode.length < 6) {
      newErrors.resetCode = "Please enter a valid reset code";
    }

    if (!newPassword || newPassword.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await verifyResetCodeAndUpdatePassword(email, resetCode, newPassword);

      toast({
        title: "Password updated successfully",
        description: "You can now log in with your new password.",
      });

      // Redirect to login page after successful password change
      setTimeout(() => {
        router.push("/auth");
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
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
          <motion.div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-primary/10" />
            <div className="relative h-full p-12">
              <Image
                src="https://res.cloudinary.com/doaxoti6i/image/upload/v1740072191/Reset_password-bro_brbudq.png"
                alt="Reset Password Illustration"
                width={500}
                height={500}
                className="mx-auto"
              />
              <div className="mt-8 text-center">
                <h1 className="text-3xl font-bold text-primary">
                  Create New Password
                </h1>
                <p className="mt-2 text-primary/80">
                  Enter your reset code and choose a new password
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Change Password Form */}
          <div className="flex items-center p-8 lg:p-12">
            <div className="mx-auto max-w-md space-y-8 w-full">
              <AnimatePresence mode="wait">
                {!success ? (
                  <motion.div
                    key="form"
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <motion.div variants={formControls} custom={0}>
                        <Label htmlFor="resetCode">Reset Code</Label>
                        <div className="relative mt-1">
                          <Input
                            id="resetCode"
                            type="text"
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            placeholder="Enter reset code"
                            className={errors.resetCode ? "border-red-500" : ""}
                          />
                          {errors.resetCode && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.resetCode}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      <motion.div variants={formControls} custom={1}>
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className={errors.password ? "border-red-500" : ""}
                          />
                          {errors.password && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.password}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      <motion.div variants={formControls} custom={2}>
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className={errors.confirm ? "border-red-500" : ""}
                          />
                          {errors.confirm && (
                            <p className="mt-1 text-xs text-red-500">
                              {errors.confirm}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      <motion.div variants={formControls} custom={3}>
                        <Button
                          type="submit"
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                          disabled={loading}
                        >
                          {loading ? "Updating..." : "Update Password"}
                          <Lock className="ml-2 h-4 w-4" />
                        </Button>
                      </motion.div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6"
                  >
                    <div className="mx-auto h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-dark">
                      Password Updated Successfully
                    </h2>
                    <p className="text-text-secondary">
                      Your password has been changed. You can now log in with
                      your new password.
                    </p>
                    <Button
                      onClick={() => router.push("/auth")}
                      className="mt-4 bg-primary hover:bg-primary/90 text-white"
                    >
                      Go to Login <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

export default function ChangePassword() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ChangePasswordContent />
    </Suspense>
  );
}

