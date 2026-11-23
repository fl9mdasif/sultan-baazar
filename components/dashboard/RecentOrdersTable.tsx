import Link from "next/link";
import type { TOrder } from "@/types/common";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";

export default function RecentOrdersTable({ orders, viewAllHref }: { orders: TOrder[]; viewAllHref: string }) {
    return (
        <section className="xl:col-span-2 bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Recent orders</h2>
                <Link
                    href={viewAllHref}
                    className="text-sm font-semibold text-[#B5451B] hover:underline underline-offset-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                >
                    View all
                </Link>
            </div>
            {orders.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">No orders yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500">
                                <th className="py-2 px-3">Order</th>
                                <th className="py-2 px-3">Customer</th>
                                <th className="py-2 px-3">Amount</th>
                                <th className="py-2 px-3">Status</th>
                                <th className="py-2 px-3">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">{order.orderNumber}</td>
                                    <td className="py-3 px-3 text-gray-600">{order.shippingAddress?.fullName || "—"}</td>
                                    <td className="py-3 px-3 font-bold text-gray-900 whitespace-nowrap">৳{(order.totalAmount || 0).toLocaleString()}</td>
                                    <td className="py-3 px-3"><OrderStatusBadge status={order.orderStatus} /></td>
                                    <td className="py-3 px-3 text-gray-500 text-xs whitespace-nowrap">
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
