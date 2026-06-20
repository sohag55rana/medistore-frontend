"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { UserX, ShieldCheck, User } from "lucide-react";

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: string;
  isBanned: boolean;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://medistore-backend-d6d5.onrender.com";
      const response = await axios.get(`${baseUrl}/api/admin/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch {
      console.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleBanToggle = async (userId: string, currentBanStatus: boolean) => {
    const action = currentBanStatus ? "approve" : "ban";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://medistore-backend-d6d5.onrender.com";
      await axios.patch(
        `${baseUrl}/api/admin/users/${userId}/ban`,
        { isBanned: !currentBanStatus },
        { withCredentials: true },
      );
      alert(`User ${action}ned successfully!`);
      fetchUsers();
    } catch {
      alert("Failed to update user status.");
    }
  };

  if (loading)
    return <div className="text-center py-20">Loading platform users...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Admin Panel: Manage Users
      </h1>
      <p className="text-gray-500 mb-8">
        Monitor user accounts and restrict or grand access instantly.
      </p>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
              <th className="p-4">User Details</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="p-4 font-medium text-gray-900 flex items-center space-x-3">
                  <div className="bg-gray-100 p-2 rounded-full text-gray-500">
                    <User className="h-4 w-4" />
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === "ADMIN" ? "bg-red-50 text-red-600" : u.role === "SELLER" ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${u.isBanned ? "bg-amber-100 text-amber-700" : "bg-emerald-50 text-emerald-600"}`}
                  >
                    {u.isBanned ? "Banned" : "Active"}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleBanToggle(u.id, u.isBanned)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center mx-auto space-x-1 ${u.isBanned ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}
                  >
                    {u.isBanned ? (
                      <>
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>approve</span>
                      </>
                    ) : (
                      <>
                        <UserX className="h-3.5 w-3.5" />
                        <span>Ban User</span>
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
