"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Package, Calendar, MapPin } from "lucide-react";

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
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (!savedUser) {
          setError("User not authenticated. Please login.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(savedUser);
        const userId = user.id;

        const response = await axios.get(
          `http://localhost:5000/api/orders/user/${userId}`,
          { withCredentials: true },
        );

        setOrders(response.data);
      } catch {
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 font-medium text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-medium">{error}</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          No Orders Found Here
        </h2>
        <p className="text-gray-500 mb-6">You haven`t placed any orders yet.</p>
        <Link
          href="/shop"
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Your Order History
      </h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-gray-50 p-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Order ID
                  </p>
                  <Link
                    href={`/orders/${order.id}`}
                    className="hover:underline text-emerald-600 font-semibold"
                  >
                    #{order.id.slice(-6)} (View Details)
                  </Link>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Date Placed
                  </p>
                  <p className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Total Amount
                  </p>
                  <p className="text-sm font-bold text-emerald-600">
                    ৳ {order.totalAmount}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === "PLACED"
                    ? "bg-blue-50 text-blue-600"
                    : order.status === "DELIVERED"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order Body & Items */}
            <div className="p-4 space-y-4">
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 shrink-0" />
                <p>
                  <strong>Shipping To:</strong> {order.shippingAddress}
                </p>
              </div>

              <div className="border-t border-gray-50 pt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Items Ordered
                </p>
                <div className="divide-y divide-gray-50">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-2 flex justify-between text-sm"
                    >
                      <span className="text-gray-800 font-medium">
                        {item.medicine?.name}{" "}
                        <span className="text-gray-400 text-xs">
                          x{item.quantity}
                        </span>
                      </span>
                      <span className="text-gray-900 font-semibold">
                        ৳ {item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
