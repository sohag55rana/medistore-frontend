"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

interface Stats {
  totalMedicines: number;
  lowStockMedicines: number;
  totalOrders: number;
  totalEarnings: number;
}

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/orders/seller-stats",
          {
            withCredentials: true,
          },
        );
        console.log("Dashboard API Response:", response.data);
        setStats(response.data);
      } catch {
        console.error("Failed to fetch dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 font-medium text-gray-600">
        Loading Dashboard...
      </div>
    );
  if (!stats)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load statistics.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to Seller Dashboard
      </h1>
      <p className="text-gray-500 mb-8">
        Here is the quick business overview of your online pharmacy.
      </p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Card 1: Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Total Revenue
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              ৳ {stats.totalEarnings}
            </h3>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg text-emerald-600">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Total Orders
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalOrders} Pcs
            </h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg text-blue-600">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Total Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Total Products
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {stats.totalMedicines} Items
            </h3>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
            <Package className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">
              Low Stock Alert
            </p>
            <h3 className="text-2xl font-bold text-amber-600 mt-1">
              {stats.lowStockMedicines} Items
            </h3>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Quick Management Actions */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">
          Quick Management Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/seller/orders"
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-500 transition flex justify-between items-center group"
          >
            <span className="text-sm font-medium text-gray-700">
              View & Process Incoming Order
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition" />
          </Link>
          <Link
            href="/seller/medicines"
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-emerald-500 transition flex justify-between items-center group"
          >
            <span className="text-sm font-medium text-gray-700">
              Manage Medicine Inventory & Stocks
            </span>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600 transition" />
          </Link>
        </div>
      </div>
    </div>
  );
}
