"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserInfo } from "@/services/auth.services";
import { useGetMyOrdersQuery } from "@/redux/api/orderApi";
import {
    ShoppingCart, Clock, CheckCircle, XCircle, Package, Settings, Truck, RotateCcw,
} from "lucide-react";
import { TOrder } from "@/types/common";
import StatCard, { STAT_GRID } from "@/components/dashboard/StatCard";
import QuickLinks, { type QuickLink } from "@/components/dashboard/QuickLinks";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";

const quickLinks: QuickLink[] = [
    { label: "My orders", href: "/dashboard/user/orders", icon: ShoppingCart, desc: "View and track all orders" },
    { label: "Account settings", href: "/dashboard/user/settings", icon: Settings, desc: "Update your profile and address" },
    { label: "Shop products", href: "/shop", icon: Package, desc: "Browse our latest products" },
];

export default function UserDashboard() {
    const router = useRouter();
    const userName = getUserInfo()?.name || getUserInfo()?.username || "there";

    const { data: myOrdersData, isLoading: ordersLoading } = useGetMyOrdersQuery(
        {},
        { pollingInterval: 5000 }
    );

    const orders: TOrder[] = Array.isArray(myOrdersData)
        ? myOrdersData
        : Array.isArray(myOrdersData?.data)
            ? myOrdersData.data
            : Array.isArray(myOrdersData?.data?.data)
                ? myOrdersData.data.data
                : [];

    const countOf = (s: string) => orders.filter((o) => o.orderStatus === s).length;

    useEffect(() => {
        const user = getUserInfo();
        if (!user) { router.replace("/login"); return; }
        if (user.role !== "user") { router.replace(`/dashboard/${user.role}`); return; }
    }, [router]);

    const statCards = [
        { label: "Total orders", value: orders.length, icon: ShoppingCart, color: "#B5451B" },
        { label: "Pending", value: countOf("pending"), icon: Clock, color: "#f59e0b" },
        // { label: "Confirmed", value: countOf("confirmed"), icon: CheckCircle, color: "#3b82f6" },
        // { label: "Processing", value: countOf("processing"), icon: Settings, color: "#0d9488" },
        { label: "Shipped", value: countOf("shipped"), icon: Truck, color: "#0ea5e9" },
        { label: "Delivered", value: countOf("delivered"), icon: CheckCircle, color: "#10b981" },
        { label: "Cancelled", value: countOf("cancelled"), icon: XCircle, color: "#ef4444" },
        { label: "Returned", value: countOf("returned"), icon: RotateCcw, color: "#6b7280" },
    ];

    const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
        .slice(0, 3);

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            <div className="mb-5 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                    Hello, {userName}
                </h1>
                <p className="text-gray-500 text-sm mt-1">Manage your orders and account details here.</p>
            </div>

            <div className={STAT_GRID.replace("xl:grid-cols-6", "xl:grid-cols-4")}>
                {statCards.map((c) => (
                    <StatCard key={c.label} {...c} value={ordersLoading ? "—" : c.value} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <QuickLinks title="Quick actions" links={quickLinks} />

                <section className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-base font-semibold text-gray-900">Recent orders</h2>
                        <Link
                            href="/dashboard/user/orders"
                            className="text-sm font-semibold text-[#B5451B] hover:underline underline-offset-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                        >
                            View all
                        </Link>
                    </div>
                    {ordersLoading ? (
                        <div className="divide-y divide-gray-100">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-14 my-1 bg-gray-100 rounded-lg animate-pulse motion-reduce:animate-none" />
                            ))}
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="flex flex-col items-center py-10 text-center">
                            <Package className="w-10 h-10 text-gray-300 mb-3" aria-hidden="true" />
                            <p className="text-sm text-gray-500 font-medium">No orders yet</p>
                            <Link
                                href="/shop"
                                className="mt-3 px-5 py-2.5 bg-[#B5451B] text-white text-sm font-semibold rounded-lg hover:bg-[#9a3915] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                            >
                                Start shopping
                            </Link>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <li key={order._id} className="flex items-center justify-between gap-3 py-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">#{order.orderNumber}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(order.createdAt ?? 0).toLocaleDateString()} — {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-sm font-bold text-gray-900">৳{order.totalAmount.toLocaleString()}</span>
                                        <OrderStatusBadge status={order.orderStatus} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
