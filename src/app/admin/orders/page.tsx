"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Clock, CheckCircle, Truck } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    name: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        withCredentials: true,
      });
      setOrders(response.data);
    } catch {
      console.error("Failed to fetch platform orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllOrders();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true },
      );
      alert("Order status updated successfully!");
      fetchAllOrders();
    } catch {
      alert("Failed to update order status.");
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading platform orders...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Global Order Overview
      </h1>
      <p className="text-gray-500 mb-8">
        Track and manage all customer purchases across the pharmacy platform.
      </p>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-gray-100">
            No orders have been placed yet.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    ID: {order.id.slice(0, 8)}...
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      order.status === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-600"
                        : order.status === "SHIPPED"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {order.status === "DELIVERED" && (
                      <CheckCircle className="h-3 w-3" />
                    )}
                    {order.status === "SHIPPED" && (
                      <Truck className="h-3 w-3" />
                    )}
                    {order.status === "PLACED" && <Clock className="h-3 w-3" />}
                    {order.status}
                  </span>
                </div>

                {/* medicine items */}
                <div className="text-sm text-gray-700 font-medium">
                  {order.items
                    .map((item) => `${item.medicine?.name} (x${item.quantity})`)
                    .join(", ")}
                </div>

                <p className="text-xs text-gray-400">
                  <span className="font-semibold text-gray-500">Address:</span>{" "}
                  {order.shippingAddress}
                </p>
              </div>

              <div className="flex sm:items-center md:items-end justify-between md:flex-col w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 gap-4">
                <div>
                  <p className="text-xs text-gray-400 md:text-right">
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    ৳ {order.totalAmount}
                  </p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="text-xs font-medium bg-gray-50 border border-gray-200 rounded-lg p-2 focus:outline-emerald-500"
                >
                  <option value="PLACED">Placed</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
