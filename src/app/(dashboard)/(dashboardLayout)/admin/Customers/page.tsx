"use client";

import React, { useState } from "react";
import { ChartCard } from "@/components/modules/Dashboard/Customers/ChartCard";
import { StatCard } from "@/components/shared/StatCard";
import { StatCardLight } from "@/components/shared/StatCardLight";
import { useGetAllUsersQuery } from "@/redux/featured/user/userApi";

const CustomersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: users, isLoading } = useGetAllUsersQuery({
    role: "customer",
    searchTerm: searchTerm,
  });

  return (
    <main className="px-6 space-y-6 py-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex flex-col gap-4">
          <StatCard />
          <StatCardLight />
          <StatCardLight title="Visitor" value="250k" changePercent={2.5} />
        </div>
        <div className="flex-1 col-span-3">
          <ChartCard />
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="w-full max-w-full bg-white h-10 border rounded-md flex items-center px-3 shadow-sm focus-within:ring-2 focus-within:ring-[#C9C9C926] transition">
        <input
          type="text"
          placeholder="Search by name, phone or email..."
          className="flex-grow bg-transparent outline-none text-sm placeholder-gray-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-gray-500"><circle cx="11" cy="11" r="8"></circle><line x1="21" x2="16.65" y1="21" y2="16.65"></line></svg>
      </div>

      {/* Dynamic Data Table */}
      <div className="bg-white rounded-2xl shadow-sm p-4 w-full max-w-full overflow-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="text-left p-3">NAME</th>
              <th className="text-left p-3">PHONE NUMBER</th>
              <th className="text-left p-3">CREATED</th>
              <th className="text-left p-3">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">Loading customers...</td>
              </tr>
            ) : users?.length ? (
              users.map((user: any) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-400 overflow-hidden flex items-center justify-center text-white font-bold uppercase">
                      {user.name?.firstName?.[0] || "U"}
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.name?.firstName} {user.name?.lastName}
                      </div>
                      <div className="text-gray-500 text-xs">{user.email}</div>
                    </div>
                  </td>
                  <td className="p-3">{user.contactNo || "N/A"}</td>
                  <td className="p-3">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-3 flex gap-3">
                    <button className="text-blue-500 hover:underline text-xs">Edit</button>
                    <button className="text-red-500 hover:underline text-xs">Block</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default CustomersPage;
