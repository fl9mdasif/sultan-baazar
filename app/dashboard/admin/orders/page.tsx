"use client";

import { useState } from "react";
import {
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
    useReviewReturnMutation,
} from "@/redux/api/orderApi";
import {
    Search,
    Eye,
    Loader2,
    AlertTriangle,
    Package,
    X,
    ChevronDown,
} from "lucide-react";
import { TableRowSkeleton } from "@/components/shared/skeletons";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { TOrder, TProduct } from "@/types/common";

const getPopulatedProduct = (product: string | TProduct): TProduct | null =>
    typeof product === "string" ? null : product;
type ApiError = { data?: { message?: string } };
const getErrorMessage = (error: unknown, fallback: string) =>
    typeof error === "object" && error !== null && "data" in error
        ? ((error as ApiError).data?.message ?? fallback)
        : fallback;
import Image from "next/image";

// ── Helpers ─────────────────────────────────────────────────────────────
import { OrderDetailsModal, STATUS_COLORS, formatDate } from "./order.modal";


// ── Search field config ───────────────────────────────────────────────────────
type OrderSearchField = "orderNumber" | "customerName" | "phone";

const ORDER_SEARCH_FIELDS: { value: OrderSearchField; label: string; placeholder: string }[] = [
    { value: "orderNumber", label: "Order #", placeholder: "Search by order number, e.g. ORD-001..." },
    { value: "customerName", label: "Customer", placeholder: "Search by customer name..." },
    { value: "phone", label: "Phone", placeholder: "Search by phone number..." },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState<OrderSearchField>("orderNumber");
    const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
    const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
    const [page, setPage] = useState(1);

    const { data, refetch, isLoading, isError } = useGetAllOrdersQuery({
        page,
        limit: 15,
        status: orderStatusFilter !== "all" ? orderStatusFilter : undefined,
        paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
        search: searchTerm || undefined,
    });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
    const [reviewReturn] = useReviewReturnMutation();

    const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);


    // console.log(selectedOrder);
    // Extract orders
    const orders: TOrder[] = Array.isArray(data?.data) ? data.data : [];
    const total: number = data?.meta?.total ?? orders.length;
    const limit: number = data?.meta?.limit ?? 15;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Filter orders REMOVED - server handles this
    const filteredOrders = orders;

    const handleStatusChange = async (orderId: string, currentStatus: string, newStatus: string) => {
        if (currentStatus === newStatus) return;
        const transitions: Record<string, string[]> = { pending: ["confirmed", "cancelled"], confirmed: ["processing", "cancelled"], processing: ["shipped"], shipped: ["delivered"], delivered: ["returned"] };
        if (!transitions[currentStatus]?.includes(newStatus)) { toast.error(`Cannot change ${currentStatus} to ${newStatus}`); return; }
        if ((newStatus === "cancelled" || newStatus === "returned") && !window.confirm(`Confirm ${newStatus} for this order?`)) return;
        try {
            await updateStatus({ id: orderId, data: { status: newStatus } }).unwrap();
            toast.success("Order status updated");
            refetch()

        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to update status"));
        }
    };


    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Orders
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track all customer orders
                    </p>
                </div>
            </div>

            {/* Toolbar: Search + Filters */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search Field Selector + Input */}
                <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#B5451B] transition-colors flex-1 min-w-[220px] max-w-sm shadow-sm">
                    <select
                        value={searchField}
                        onChange={(e) => { setSearchField(e.target.value as OrderSearchField); setSearchTerm(""); setPage(1); }}
                        className="text-xs font-semibold text-gray-500 bg-gray-50 border-r border-gray-200 px-3 py-2.5 outline-none cursor-pointer h-full hover:bg-gray-100 transition-colors"
                    >
                        {ORDER_SEARCH_FIELDS.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                    <div className="flex items-center flex-1 px-3 gap-2">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder={ORDER_SEARCH_FIELDS.find(f => f.value === searchField)?.placeholder}
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400 py-2.5"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm("")} className="text-gray-400 hover:text-gray-600">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Order Status Filter */}
                <div className="relative">
                    <select
                        value={orderStatusFilter}
                        onChange={(e) => { setOrderStatusFilter(e.target.value); setPage(1); }}
                        className={`text-sm font-medium rounded-xl px-4 py-2.5 border outline-none cursor-pointer transition-colors appearance-none pr-8 shadow-sm ${orderStatusFilter !== "all" ? "border-[#B5451B] bg-orange-50 text-[#B5451B]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="returned">Returned</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Payment Status Filter */}
                <div className="relative">
                    <select
                        value={paymentStatusFilter}
                        onChange={(e) => { setPaymentStatusFilter(e.target.value); setPage(1); }}
                        className={`text-sm font-medium rounded-xl px-4 py-2.5 border outline-none cursor-pointer transition-colors appearance-none pr-8 shadow-sm ${paymentStatusFilter !== "all" ? "border-[#B5451B] bg-orange-50 text-[#B5451B]" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                            }`}
                    >
                        <option value="all">All Payments</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                </div>

                {/* Clear filters */}
                {(searchTerm || orderStatusFilter !== "all" || paymentStatusFilter !== "all") && (
                    <button
                        onClick={() => { setSearchTerm(""); setOrderStatusFilter("all"); setPaymentStatusFilter("all"); setPage(1); }}
                        className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70">
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500">Order</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">Customer</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">Total</th>
                                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)}
                            </tbody>
                        </table>
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-20 text-red-500">
                        <AlertTriangle className="w-10 h-10 mb-4 opacity-80" />
                        <p className="text-base font-medium text-gray-900">
                            Failed to load orders
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Please try again later</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-base font-medium text-gray-900">
                            No orders found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Either you have no orders or none match your search.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full whitespace-nowrap">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500">
                                        Order ID / Date
                                    </th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500">
                                        Customer
                                    </th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500">
                                        Product
                                    </th>
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500">
                                        Amount
                                    </th>
                                    {/* <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500">
                                        Payment Status
                                    </th> */}
                                    <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500">
                                        Order Status
                                    </th>
                                    <th className="text-right px-5 py-4 text-xs font-semibold text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        {/* Order ID & Date */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-md text-gray-900">
                                                    {order.orderNumber}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    {formatDate(order.createdAt || new Date().toISOString())}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {order.shippingAddress.fullName}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    {order.shippingAddress.phone}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Product Info */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col gap-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded border border-gray-100 bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                            {getPopulatedProduct(item.product)?.thumbnail ? (
                                                                <Image
                                                                    src={getPopulatedProduct(item.product)?.thumbnail || ""}
                                                                    alt={item.variant?.name || "Product"}
                                                                    width={40}
                                                                    height={40}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            ) : (
                                                                <Package className="w-5 h-5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <span className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                                                                {getPopulatedProduct(item.product)?.name || item.variant?.name || "Unknown Product"}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                Qty: {item.quantity}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-5 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">
                                                    ৳{order.totalAmount}
                                                </span>
                                                <span className="text-xs text-gray-500 mt-0.5">
                                                    {order.items.length} item(s)
                                                </span>
                                                {(order.discount ?? 0) > 0 && (
                                                    <span className="text-xs font-semibold text-green-700 mt-0.5">
                                                        -৳{order.discount}{order.promotion?.code ? ` (${order.promotion.code})` : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Payment Status Dropdown */}
                                        {/* <td className="px-5 py-4">
                                            <select
                                                className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors cursor-pointer ${PAYMENT_STATUS_COLORS[order.paymentStatus || "pending"]
                                                    } ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
                                                value={order.paymentStatus || "pending"}
                                                onChange={(e) =>
                                                    handlePaymentStatusChange(order._id, order.paymentStatus || "pending", e.target.value)
                                                }
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="paid">Paid</option>
                                                <option value="failed">Failed</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </td> */}

                                        {/* Order Status Dropdown */}
                                        <td className="px-5 py-4">
                                            <select
                                                className={`text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors cursor-pointer ${STATUS_COLORS[order.orderStatus]
                                                    } ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}
                                                value={order.orderStatus}
                                                onChange={(e) =>
                                                    handleStatusChange(order._id, order.orderStatus, e.target.value)
                                                }
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                                {(order.returnRequest?.status === "requested" || order.orderStatus === "returned") && <option value="returned">Returned</option>}
                                            </select>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {order.returnRequest?.status === "requested" && <>
                                                    <Button size="sm" onClick={async () => { await reviewReturn({ id: order._id, action: "approve" }).unwrap(); toast.success("Return approved"); refetch(); }}>Approve return</Button>
                                                    <Button size="sm" variant="outline" onClick={async () => { const note = window.prompt("Rejection reason") ?? undefined; await reviewReturn({ id: order._id, action: "reject", note }).unwrap(); toast.success("Return rejected"); refetch(); }}>Reject</Button>
                                                </>}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors rounded-lg"
                                                    type="button"
                                                    onClick={() => setSelectedOrder(order)}
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onChange={setPage} />

            <OrderDetailsModal
                open={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />
        </div>
    );
}
