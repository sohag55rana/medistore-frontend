"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Folder } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://medistore-backend-d6d5.onrender.com";

      const response = await axios.get(`${baseUrl}/api/medicines/categories`, {
        withCredentials: true,
      });
      setCategories(response.data);
    } catch {
      console.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleCreateCategory = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setSubmitting(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://medistore-backend-d6d5.onrender.com";

      await axios.post(
        `${baseUrl}/api/medicines/categories`,
        { name: newCategoryName },
        { withCredentials: true },
      );
      alert("Category created successfully!");
      setNewCategoryName("");
      fetchCategories();
    } catch {
      alert("Failed to create category.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading categories...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Manage Medicine Categories
      </h1>
      <p className="text-gray-500 mb-8">
        Create and view categories for the pharmacy marketplace.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit">
          <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">
            Add New Category
          </h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                Category Name
              </label>
              <input
                type="text"
                placeholder="e.g., Tablet, Syrup"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-sm transition flex items-center justify-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>{submitting ? "Creating..." : "Add Category"}</span>
            </button>
          </form>
        </div>

        <div className="md:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                <th className="p-4">Category Name</th>
                <th className="p-4 text-center">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-gray-400">
                    No categories found. Create one!
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium text-gray-900 flex items-center space-x-3">
                      <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                        <Folder className="h-4 w-4" />
                      </div>
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-4 text-xs font-mono text-gray-400 text-center">
                      {cat.id}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
