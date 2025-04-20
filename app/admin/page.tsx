"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  DollarSign,
  BarChart2,
  MessageSquare,
  Image,
  Video,
} from "lucide-react";
import { useEffect } from "react";
import useManagementStore from "@/store/useManagementStore";

const quickLinks = [
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "Avatar Management", href: "/admin/avatars", icon: Image },
  { name: "Tutorials", href: "/admin/tutorials", icon: Video },
  { name: "Tickets", href: "/admin/tickets", icon: MessageSquare },
  { name: "Subscriptions", href: "/admin/subscriptions", icon: DollarSign },
];

export default function AdminOverviewPage() {
  const { overview, fetchOverview, isLoading } = useManagementStore();

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : overview?.users.total.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "..."
                  : `${overview?.users.growthRate}% from last month`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : `$${overview?.revenue.total.toLocaleString()}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "..."
                  : `${overview?.revenue.subscriptionGrowthRate}% from last month`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Projects
              </CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : overview?.projects.total.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {isLoading
                  ? "..."
                  : `${overview?.projects.growthRate}% from last month`}
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {link.name}
                  </CardTitle>
                  <link.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Manage {link.name.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>
    </AdminLayout>
  );
}

