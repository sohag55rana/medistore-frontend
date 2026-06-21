"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      setError("Please provide a shipping address.");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formattedItems = cart.map((item) => ({
        medicineId: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://medistore-backend-d6d5.onrender.com";

      const response = await axios.post(
        `${baseUrl}/api/orders/create`,
        {
          shippingAddress,
          items: formattedItems,
        },
        { withCredentials: true },
      );

      if (response.status === 201) {
        setSuccess("Order placed successfully!");
        clearCart();
        setShippingAddress("");

        setTimeout(() => {
          router.push("/shop");
        }, 2000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to place order. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Your Cart is Empty
        </h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven`t added any medicines to your cart yet.
        </p>
        <Link
          href="/shop"
          className="bg-emerald-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-lg mb-4 text-sm text-center">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-emerald-600 font-medium text-sm mt-1">
                  ৳ {item.price} / pcs
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-lg p-1 space-x-2 bg-gray-50">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-1 hover:bg-white rounded text-gray-500 transition"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-semibold text-gray-800 w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        stock: item.stock,
                      })
                    }
                    disabled={item.quantity >= item.stock}
                    className="p-1 hover:bg-white rounded text-gray-500 transition disabled:opacity-30"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <span className="font-bold text-gray-900 min-w-15 text-right">
                  ৳ {item.price * item.quantity}
                </span>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:underline font-medium pt-2 block"
          >
            Clear All Items
          </button>
        </div>

        {/* Right Side: Order Summary & Address */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">
              Delivery Address
            </h2>
            <textarea
              required
              rows={2}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter full address (e.g. House 12, Road 5, Dhaka)"
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 pb-4 border-b border-gray-100">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal</span>
                <span>৳ {totalPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Delivery Charge</span>
                <span className="text-emerald-600 font-medium">FREE</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-lg pt-4 mb-6">
              <span>Total</span>
              <span>৳ {totalPrice}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition shadow-sm disabled:bg-gray-400"
            >
              {loading ? "Placing Order..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
