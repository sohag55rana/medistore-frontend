"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit2, Trash2, X } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  } | null;
  price: number;
  manufacturer: string;
  stock: number;
}

export default function SellerInventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/medicines", {
        withCredentials: true,
      });
      setMedicines(response.data);
    } catch {
      console.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/medicines/${id}`, {
        withCredentials: true,
      });
      setMedicines(medicines.filter((med) => med.id !== id));
      alert("Medicine deleted successfully!");
    } catch {
      alert("Failed to delete medicine.");
    }
  };

  const startEdit = (medicine: Medicine) => {
    setEditingMedicine(medicine);
    setName(medicine.name);
    setPrice(medicine.price);
    setStock(medicine.stock);
  };

  const handleUpdate = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMedicine) return;

    try {
      await axios.put(
        `http://localhost:5000/api/medicines/${editingMedicine.id}`,
        { name, price, stock },
        { withCredentials: true },
      );

      alert("Updated successfully!");
      setEditingMedicine(null);
      fetchInventory();
    } catch {
      alert("Failed to update medicine.");
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading inventory...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Manage Medicine Inventory
        </h1>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <th className="p-4">Medicine Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock Level</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {medicines.map((med) => (
              <tr key={med.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-medium text-gray-900">{med.name}</td>
                <td className="p-4">{med.category?.name || "No Category"}</td>
                <td className="p-4 font-semibold">৳ {med.price}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${med.stock > 10 ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                  >
                    {med.stock} Pcs
                  </span>
                </td>
                <td className="p-4 flex justify-center space-x-3">
                  <button
                    onClick={() => startEdit(med)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingMedicine && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-bold text-gray-900">
                Edit Medicine Info
              </h2>
              <button onClick={() => setEditingMedicine(null)}>
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Medicine Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-emerald-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Price (৳)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-emerald-500"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
