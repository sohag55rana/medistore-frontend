"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ClipboardList, Check, X, MapPin } from "lucide-react";

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

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        "https://medistore-backend-d6d5.onrender.com/api/orders",
        {
          withCredentials: true,
        },
      );
      setOrders(response.data);
    } catch {
      setError("Failed to load orders.");
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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setActionLoading(orderId);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://medistore-backend-d6d5.onrender.com";
      await axios.patch(
        `${baseUrl}/api/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true },
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order,
        ),
      );
    } catch {
      alert("Failed to update status.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 font-medium text-gray-600">
        Loading incoming orders...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-600 font-medium">{error}</div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
        <ClipboardList className="mr-2 text-emerald-600" /> Seller Order
        Management
      </h1>
      <p className="text-gray-500 mb-8">
        Manage customer orders and update shipping status.
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">No customer has ordered anything yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-3"
            >
              {/* left column: order info */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    order.status === "PLACED"
                      ? "bg-blue-50 text-blue-600"
                      : order.status === "DELIVERED"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                  }`}
                >
                  {order.status}
                </span>
                <h3 className="font-bold text-gray-800 mt-3 text-sm">
                  Order #{order.id.slice(-6)}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400 shrink-0" />
                    <span className="truncate">
                      <strong>Address:</strong> {order.shippingAddress}
                    </span>
                  </div>
                </div>
              </div>

              {/* middle column: items list */}
              <div className="p-5 md:col-span-1 border-b md:border-b-0 md:border-r border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Items Ordered
                </p>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-sm flex justify-between">
                      <span className="text-gray-700">
                        {item.medicine?.name}{" "}
                        <strong className="text-xs text-gray-400">
                          x{item.quantity}
                        </strong>
                      </span>
                      <span className="font-medium text-gray-900">
                        ৳{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total Earnings:</span>
                  <span className="text-emerald-600">৳{order.totalAmount}</span>
                </div>
              </div>

              {/* right column: action buttons */}
              <div className="p-5 flex flex-col justify-center items-center space-y-3">
                {order.status === "PLACED" ? (
                  <>
                    <button
                      disabled={actionLoading === order.id}
                      onClick={() => handleStatusUpdate(order.id, "DELIVERED")}
                      className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check className="h-4 w-4" /> Mark as Delivered
                    </button>
                    <button
                      disabled={actionLoading === order.id}
                      onClick={() => handleStatusUpdate(order.id, "CANCELLED")}
                      className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition flex items-center justify-center gap-1"
                    >
                      <X className="h-4 w-4" /> Cancel Order
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 font-medium bg-gray-50 px-4 py-2 rounded-lg border border-dashed">
                    No actions available
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
