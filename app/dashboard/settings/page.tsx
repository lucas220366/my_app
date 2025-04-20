"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff } from "lucide-react";
import UserLayout from "@/components/layouts/UserLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import useProfileStore from "@/store/useProfileStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

export default function SettingsPage() {
  const { toast } = useToast();
  const {
    fetchProfile,
    user,
    isLoading,
    error,
    updateProfile,
    updatePassword,
  } = useProfileStore();
  const [profile, setProfile] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
  });
  console.log(user?.fullName, user?.email, isLoading, error);

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.fullName,
        email: user.email,
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        fullName: profile.name,
        email: profile.email,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast({
        title: "Error",
        description: error || "Failed to update password",
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <UserLayout>
      <motion.div
        className="max-w-6xl mx-auto space-y-12 px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2 text-center">
          <motion.h1
            className="text-2xl font-bold text-text-primary"
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            Account Settings
          </motion.h1>
          <motion.p
            className="text-xl text-text-secondary"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
          >
            Manage your profile and security preferences
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 lg:grid-cols-2"
        >
          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Profile Settings
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white transition-all duration-300"
                disabled={isLoading}
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Loading..." : "Save Changes"}
              </Button>
            </form>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Change Password
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {["current", "new", "confirm"].map((field) => (
                <div key={field}>
                  <Label htmlFor={`${field}-password`}>
                    {field.charAt(0).toUpperCase() + field.slice(1)} Password
                  </Label>
                  <div className="relative">
                    <Input
                      id={`${field}-password`}
                      name={field}
                      type={
                        showPasswords[field as keyof typeof showPasswords]
                          ? "text"
                          : "password"
                      }
                      value={passwords[field as keyof typeof passwords]}
                      onChange={handlePasswordChange}
                      required
                      className="pr-10 transition-all duration-300 focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        togglePasswordVisibility(
                          field as "current" | "new" | "confirm"
                        )
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords[field as keyof typeof showPasswords] ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white transition-all duration-300"
              >
                {isLoading ? "Loading..." : "Change Password"}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </motion.div>
    </UserLayout>
  );
}

