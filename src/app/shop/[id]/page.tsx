"use client";

import { useState, useEffect, useCallback, use } from "react";
import axios from "axios";
import { Pill, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import MedicineReviews from "@/components/MedicineReviews";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
}

export default function MedicineDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const medicineId = resolvedParams.id;

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = useCallback(async () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://medistore-backend-d6d5.onrender.com";
      const res = await axios.get(`${baseUrl}/api/medicines/${medicineId}`);
      setMedicine(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [medicineId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDetails();
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchDetails]);

  if (loading)
    return (
      <div className="p-10 text-center font-medium text-gray-500">
        Loading........
      </div>
    );
  if (!medicine)
    return (
      <div className="p-10 text-center font-medium text-red-500">
        Medicine not found!!!!
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-12 px-6 max-w-5xl mx-auto">
      <Link
        href="/shop"
        className="text-sm text-gray-500 hover:text-emerald-600 flex items-center gap-1 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border border-gray-100 p-8 rounded-2xl shadow-sm mb-12">
        <div className="bg-emerald-50 rounded-2xl flex items-center justify-center p-12 aspect-square">
          <Pill className="h-32 w-32 text-emerald-600" />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              {medicine.name}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              By {medicine.manufacturer}
            </p>
            <p className="text-2xl font-black text-gray-900 mt-4">
              ৳ {medicine.price.toFixed(2)}
            </p>
            <p className="text-gray-600 text-sm mt-6 border-t border-gray-100 pt-4">
              {medicine.description}
            </p>
          </div>

          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl mt-6 flex items-center justify-center gap-2 transition">
            <ShoppingCart className="h-5 w-5" /> Add to Cart
          </button>
        </div>
      </div>

      <MedicineReviews medicineId={medicineId} />
    </div>
  );
}
