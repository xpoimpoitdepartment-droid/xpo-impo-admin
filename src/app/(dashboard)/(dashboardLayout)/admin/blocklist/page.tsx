"use client";

import { useGetBlockedPhonesQuery, useUnblockPhoneMutation } from "@/redux/featured/order/orderApi";
import toast from "react-hot-toast";

export default function BlocklistPage() {
    const { data: blockedPhones = [], isLoading } = useGetBlockedPhonesQuery();
    const [unblockPhone, { isLoading: isUnblocking }] = useUnblockPhoneMutation();

    const handleUnblock = async (phone: string) => {
        if (confirm(`Are you sure you want to unblock ${phone}? They will be able to place orders again.`)) {
            try {
                await unblockPhone(phone).unwrap();
                toast.success(`Phone number ${phone} is now unblocked.`);
            } catch (err: any) {
                toast.error(err?.data?.message || "Failed to unblock number.");
            }
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Blocked Phone Numbers</h1>

            {isLoading ? (
                <p>Loading blocklist...</p>
            ) : blockedPhones.length === 0 ? (
                <p className="text-gray-500">No phone numbers are currently blocked.</p>
            ) : (
                <div className="bg-white rounded-lg shadow border overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 border-b">
                            <tr>
                                <th className="p-4 font-semibold">Phone Number</th>
                                <th className="p-4 font-semibold">Blocked At</th>
                                <th className="p-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blockedPhones.map((b: any) => (
                                <tr key={b._id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="p-4 font-medium text-red-600">{b.phone}</td>
                                    <td className="p-4 text-gray-500">{new Date(b.createdAt).toLocaleString()}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleUnblock(b.phone)}
                                            disabled={isUnblocking}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                                        >
                                            Unblock
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
