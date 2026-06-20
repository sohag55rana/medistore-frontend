"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  manufacturer: string;
}

export default function ShopPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/medicines");
        setMedicines(response.data);
      } catch {
        setError("Failed to load medicines. Make sure backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 font-medium">Loading medicines...</div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-600 font-medium">{error}</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="border-b border-gray-200 pb-5 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          All Medicines
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Search and buy authentic over-the-counter medicines.
        </p>
      </div>

      {medicines.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No medicines available in the store right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((med, index) => (
            <div
              key={med.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${med.stock > 0 ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"}`}
                  >
                    {med.stock > 0 ? `In Stock: ${med.stock}` : "Out of Stock"}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mt-3">
                  #{index + 1} - {med.name}
                </h3>

                <p className="text-xs text-gray-400 italic mb-2">
                  {med.manufacturer} Pharmaceutical
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {med.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-50">
                <span className="font-extrabold text-gray-950 text-xl">
                  ৳ {med.price.toFixed(2)}
                </span>
                <button
                  disabled={med.stock <= 0}
                  onClick={() =>
                    addToCart({
                      id: med.id,
                      name: med.name,
                      price: med.price,
                      stock: med.stock,
                    })
                  }
                  className={`text-sm font-medium px-4 py-2 rounded-md transition ${med.stock > 0 ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                >
                  Add to Cart
                </button>
              </div>
              <Link
                href={`/shop/${med.id}`}
                className="block text-center bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold py-2 rounded-lg border border-gray-200 transition"
              >
                View Details & Reviews
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
