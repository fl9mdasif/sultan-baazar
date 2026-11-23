"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/auth.services";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { useGetAllOrdersQuery, useGetOrderSummaryQuery } from "@/redux/api/orderApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import SalesChart from "@/components/dashboard/SalesChart";
import OrderStatusPieChart from "@/components/dashboard/OrderStatusPieChart";
import StatCard, { STAT_GRID } from "@/components/dashboard/StatCard";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import QuickLinks, { type QuickLink } from "@/components/dashboard/QuickLinks";
import { StatCardSkeleton, ChartSkeleton } from "@/components/shared/skeletons";
import type { TOrder } from "@/types/common";
import {
    Package, ShoppingCart, Users, TrendingUp, Settings,
    CheckCircle, XCircle, Clock, Truck, Tags, RotateCcw,
} from "lucide-react";

type Role = "admin" | "superadmin";

const superAdminLinks: QuickLink[] = [
    { label: "Manage categories", href: "/dashboard/admin/categories", icon: Tags, desc: "Add, edit and delete categories" },
    { label: "Manage products", href: "/dashboard/superadmin/products", icon: Package, desc: "Add, edit and delete products" },
    { label: "All orders", href: "/dashboard/superadmin/orders", icon: ShoppingCart, desc: "Track and update order statuses" },
    { label: "Manage users", href: "/dashboard/superadmin/users", icon: Users, desc: "View and manage accounts" },
    { label: "Site settings", href: "/dashboard/superadmin/settings", icon: Settings, desc: "Configure platform settings" },
];

export default function AdminOverview({ role }: { role: Role }) {
    const router = useRouter();
    const userName = getUserInfo()?.name || getUserInfo()?.username || (role === "admin" ? "Admin" : "Super admin");

    const { data: productsData, isLoading: loadingProducts } = useGetAllProductsQuery({ limit: 1 });
    const { data: ordersData, isLoading: loadingOrders } = useGetAllOrdersQuery({ limit: 5 });
    const { data: summary, isLoading: loadingSummary } = useGetOrderSummaryQuery();
    const { data: usersData, isLoading: loadingUsers } = useGetAllUsersQuery({ limit: 1 });
    const isLoading = loadingProducts || loadingOrders || loadingUsers || loadingSummary;

    const totalProducts =
        productsData?.meta?.total ??
        productsData?.data?.meta?.total ??
        productsData?.data?.total ?? 0;

    const totalUsers =
        usersData?.meta?.total ??
        usersData?.data?.meta?.total ??
        usersData?.total ??
        usersData?.data?.total ?? 0;

    const recentOrders: TOrder[] = Array.isArray(ordersData?.data) ? ordersData.data : [];
    const counts = summary?.counts ?? {};

    const statCards = [
        { label: "Products", value: totalProducts, icon: Package, color: "#B5451B" },
        { label: "Users", value: totalUsers, icon: Users, color: "#B5451B" },
        { label: "Orders", value: summary?.total ?? 0, icon: ShoppingCart, color: "#D4860A" },
        { label: "Sales", value: `৳${(summary?.revenue ?? 0).toLocaleString()}`, icon: TrendingUp, color: "#059669" },
        { label: "Pending", value: counts.pending ?? 0, icon: Clock, color: "#f59e0b" },
        { label: "Confirmed", value: counts.confirmed ?? 0, icon: CheckCircle, color: "#3b82f6" },
        { label: "Processing", value: counts.processing ?? 0, icon: Settings, color: "#0d9488" },
        { label: "Shipped", value: counts.shipped ?? 0, icon: Truck, color: "#0ea5e9" },
        { label: "Delivered", value: counts.delivered ?? 0, icon: CheckCircle, color: "#10b981" },
        { label: "Cancelled", value: counts.cancelled ?? 0, icon: XCircle, color: "#ef4444" },
        { label: "Returned", value: counts.returned ?? 0, icon: RotateCcw, color: "#6b7280" },
    ];

    useEffect(() => {
        const user = getUserInfo();
        if (!user) { router.replace("/login"); return; }
        if (user.role !== role) { router.replace(`/dashboard/${user.role}`); return; }
    }, [router, role]);

    const ordersHref = role === "admin" ? "/dashboard/admin/orders" : "/dashboard/superadmin/orders";

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="mb-5 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                    {role === "admin" ? `Welcome back, ${userName}` : "Super admin panel"}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                    {role === "admin" ? "Here is what is happening with Sultan Bazar today." : `Welcome, ${userName}. Full platform control.`}
                </p>
            </div>

            {isLoading ? (
                <>
                    <div className={STAT_GRID}>
                        {Array.from({ length: 11 }).map((_, i) => <StatCardSkeleton key={i} />)}
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        <div className="xl:col-span-2"><ChartSkeleton /></div>
                        <div className="xl:col-span-1"><ChartSkeleton /></div>
                    </div>
                </>
            ) : (
                <>
                    <div className={STAT_GRID}>
                        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        <div className="xl:col-span-2"><SalesChart /></div>
                        <div className="xl:col-span-1"><OrderStatusPieChart counts={counts} /></div>
                    </div>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
                        <RecentOrdersTable orders={recentOrders} viewAllHref={ordersHref} />
                        {role === "superadmin" && <QuickLinks title="Admin controls" links={superAdminLinks} />}
                    </div>
                </>
            )}
        </div>
    );
}
