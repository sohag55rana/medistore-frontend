"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Pill,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Users,
  Folder,
  ShoppingBag,
  PlusCircle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { cartCount, setCartItems, clearCart } = useCart() as unknown as {
    cartCount: number;
    setCartItems?: (
      items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
      }>,
    ) => void;
    clearCart?: () => void;
  };

  const [user, setUser] = useState<{ name: string; role: string } | null>(
    () => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      }
      return null;
    },
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    if (setCartItems) {
      setCartItems([]);
    } else if (clearCart) {
      clearCart();
    }
    setUser(null);
    setDropdownOpen(false);
    window.location.href = "/login";
  };
  if (!mounted) {
    return (
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-emerald-600 font-bold text-xl"
            >
              <Pill className="h-6 w-6" />
              <span>MediStore</span>
            </Link>
            <div className="hidden md:flex space-x-8 font-medium text-gray-600">
              <Link href="/" className="hover:text-emerald-600 transition">
                Home
              </Link>
              <Link href="/shop" className="hover:text-emerald-600 transition">
                Shop
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm bg-emerald-600 text-white px-4 py-2 rounded-md">
                <User className="h-4 w-4" />
                <span>Login</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-10">
            <Link
              href="/"
              className="flex items-center space-x-2 text-emerald-600 font-bold text-xl"
            >
              <Pill className="h-6 w-6" />
              <span>MediStore</span>
            </Link>

            <div className="hidden md:flex space-x-8 font-medium text-gray-600">
              <Link href="/" className="hover:text-emerald-600 transition">
                Home
              </Link>
              <Link href="/shop" className="hover:text-emerald-600 transition">
                Shop
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/cart"
              className="text-gray-600 hover:text-emerald-600 relative transition"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 transition"
                >
                  <div className="bg-emerald-100 text-emerald-700 p-1 rounded-full">
                    <User className="h-4 w-4" />
                  </div>
                  <span>Hi, {user.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    ></div>

                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-5 duration-200">
                      {user.role === "CUSTOMER" && (
                        <Link
                          href="/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                          <ShoppingBag className="h-4 w-4 text-gray-400" />
                          <span>My Orders</span>
                        </Link>
                      )}

                      {(user.role === "SELLER" || user.role === "ADMIN") && (
                        <>
                          <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Seller Panel
                          </div>
                          <Link
                            href="/seller/dashboard"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <LayoutDashboard className="h-4 w-4 text-gray-400" />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            href="/seller/medicines"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Folder className="h-4 w-4 text-gray-400" />
                            <span>My Medicine</span>
                          </Link>
                          <Link
                            href="/seller/orders"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <ShoppingBag className="h-4 w-4 text-gray-400" />
                            <span>Seller Order</span>
                          </Link>
                          <Link
                            href="/seller/add-medicine"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-amber-600 font-medium hover:bg-amber-50/50 transition"
                          >
                            <PlusCircle className="h-4 w-4 text-amber-500" />
                            <span>Add Medicine</span>
                          </Link>
                        </>
                      )}

                      {user.role === "ADMIN" && (
                        <>
                          <div className="my-2 border-t border-gray-100"></div>
                          <div className="px-4 py-1.5 text-[10px] font-bold text-red-400 uppercase tracking-wider">
                            Admin Panel
                          </div>
                          <Link
                            href="/admin/users"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>Manage Users</span>
                          </Link>
                          <Link
                            href="/admin/categories"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <Folder className="h-4 w-4 text-gray-400" />
                            <span>Manage Categories</span>
                          </Link>
                          <Link
                            href="/admin/orders"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                          >
                            <ShoppingBag className="h-4 w-4 text-gray-400" />
                            <span>All Orders</span>
                          </Link>
                        </>
                      )}

                      <div className="my-2 border-t border-gray-100"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left font-medium"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 text-sm bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition font-medium shadow-sm shadow-emerald-200"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
