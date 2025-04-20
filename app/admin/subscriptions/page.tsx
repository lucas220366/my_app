"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useTransactionStore from "@/store/useTransactionStore";

export default function SubscriptionsPage() {
  const {
    overview,
    transactions,
    pagination,
    isLoading,
    error,
    fetchSubscriptionsOverview,
    fetchTransactions,
    downloadTransactionsCSV,
  } = useTransactionStore();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscriptionsOverview();
    fetchTransactions({ page: 1, limit: 10 });
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchTransactions({ search: searchTerm });
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <h1 className="text-3xl font-bold">Subscriptions & Transactions</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${overview?.overview.totalRevenue.toFixed(2) || "0.00"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Successful Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview?.overview.successfulTransactions || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overview?.overview.failedTransactions || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Button
            onClick={() => downloadTransactionsCSV(searchTerm)}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {isLoading ? (
          <div className="text-center py-4">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Plan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.email + transaction.transactionDate}>
                  <TableCell>{transaction.fullName}</TableCell>
                  <TableCell>{transaction.email}</TableCell>
                  <TableCell>${transaction.planPrice.toFixed(2)}</TableCell>
                  <TableCell>{transaction.transactionDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "successful"
                          ? "success"
                          : transaction.status === "pending"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.planName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </motion.div>
    </AdminLayout>
  );
}

