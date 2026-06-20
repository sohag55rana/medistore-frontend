"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Calendar, DollarSign } from "lucide-react";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  medicine: {
    name: string;
  };
}

interface OrderDetails {
  id: string;
  shippingAddress: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://medistore-backend-d6d5.onrender.com";
        const response = await axios.get(`${baseUrl}/api/orders/${id}`, {
          withCredentials: true,
        });
        setOrder(response.data);
      } catch {
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading)
    return <div className="text-center py-20">Loading order details...</div>;
  if (error)
    return <div className="text-center py-20 text-red-500">{error}</div>;

  if (!order)
    return (
      <div className="text-center py-20 text-gray-500">
        No order data found.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/orders"
        className="text-sm text-emerald-600 hover:underline flex items-center mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-gray-50 pb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
            <p className="text-sm text-gray-400 mt-1">ID: #{order.id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              order.status === "PLACED"
                ? "bg-blue-50 text-blue-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />{" "}
            <strong>Placed on:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />{" "}
            <strong>Payment Method:</strong> Cash on Delivery
          </div>
          <div className="flex items-start md:col-span-2">
            <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />{" "}
            <strong>Shipping Address:</strong> {order.shippingAddress}
          </div>
        </div>

        {/* Items List */}
        <div className="border-t border-gray-50 pt-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Package className="h-4 w-4 mr-1.5 text-emerald-600" /> Products
          </h3>
          <div className="divide-y divide-gray-50">
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="py-3 flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-800">
                    {item.medicine.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    ৳ {item.price} x {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-gray-900">
                  ৳ {item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Total Pricing */}
        <div className="border-t border-gray-100 pt-4 flex justify-between items-center font-bold text-lg text-gray-900">
          <span>Total Paid:</span>
          <span className="text-emerald-600">৳ {order.totalAmount}</span>
        </div>
      </div>
    </div>
  );
}
