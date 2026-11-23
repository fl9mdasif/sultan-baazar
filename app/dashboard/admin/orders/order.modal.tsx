"use client";

import { X, Package, Calendar, MapPin, CreditCard, Clock, Printer } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import type { TOrder, TOrderStatus, TPaymentStatus, TProduct } from "@/types/common";

const getPopulatedProduct = (product: string | TProduct): TProduct | null =>
    typeof product === "string" ? null : product;

// ── Helpers ─────────────────────────────────────────────────────────────
export const STATUS_COLORS: Record<TOrderStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    processing: "bg-purple-100 text-purple-800 border-purple-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
    returned: "bg-gray-100 text-gray-800 border-gray-200",
};

export const PAYMENT_STATUS_COLORS: Record<TPaymentStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    refunded: "bg-gray-100 text-gray-800 border-gray-200",
};

export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

// ── Order Details Modal ──────────────────────────────────────────────────────
export function OrderDetailsModal({
    open,
    onClose,
    order,
}: {
    open: boolean;
    onClose: () => void;
    order: TOrder | null;
}) {
    if (!open || !order) return null;

    const handlePrint = () => window.print();

    return (
        <>
            {/* ─── Global Print Styles ─── */}
            <style jsx global>{`
                @media print {
                    body > *:not(.print-only-invoice) {
                        display: none !important;
                    }
                    html, body {
                        background: white !important;
                        height: auto !important;
                        min-height: 0 !important;
                        margin: 0 !important;
                    }
                    .print-only-invoice {
                        display: block !important;
                        position: static !important;
                        width: 100% !important;
                        background: white !important;
                    }
                    @page {
                        size: A4 portrait;
                        margin: 12mm;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>

            {/* ─── Print-Only Invoice (Hidden on screen) ─── */}
            {createPortal(
            <div className="hidden print:block print-only-invoice font-sans bg-white p-2">
                <div className="max-w-full mx-auto border border-gray-100 p-5 shadow-sm">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b-2 border-orange-600 pb-5 mb-5">
                        <div>
                            <h1 className="text-2xl font-black text-orange-600 tracking-tighter">SULTAN BAZAR</h1>
                            <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-[0.2em]">Quality is our Identity</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-xl font-black text-gray-900">INVOICE</h2>
                            <p className="text-xs font-bold text-gray-600 mt-1 uppercase">ID: <span className="text-black">{order.orderNumber}</span></p>
                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">{formatDate(order.createdAt || new Date().toISOString())}</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <h3 className="text-[10px] font-black uppercase text-orange-600 mb-4 tracking-widest border-b border-orange-100 pb-1 inline-block">Billed To</h3>
                            <p className="font-bold text-gray-900 text-sm uppercase">{order.shippingAddress.fullName}</p>
                            <p className="text-gray-700 font-bold text-xs mt-1">{order.shippingAddress.phone}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{order.user?.email || "customer@sultanbazar.com"}</p>
                        </div>
                        <div className="p-4">
                            <h3 className="text-[10px] font-black uppercase text-orange-600 mb-4 tracking-widest border-b border-orange-100 pb-1 inline-block">Shipping Address</h3>
                            <p className="text-gray-800 font-medium leading-relaxed">
                                {order.shippingAddress.address}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.district}<br />
                                Bangladesh - {order.shippingAddress.postalCode}
                            </p>
                        </div>
                    </div>

                    {/* Table */}
                    <table className="w-full text-left border-collapse mb-6">
                        <thead>
                            <tr className="bg-orange-600 text-white rounded-t-lg">
                                <th className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-tl-lg">Item Description</th>
                                <th className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-center">Qty</th>
                                <th className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-right">Price</th>
                                <th className="px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-right rounded-tr-lg">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border-x border-b border-gray-100">
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="px-3 py-3">
                                        <p className="font-bold text-gray-900 text-sm uppercase">{getPopulatedProduct(item.product)?.name || item.variant?.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">SKU: {item.variant.sku} | {item.variant.name}</p>
                                    </td>
                                    <td className="px-3 py-3 text-center font-black text-gray-900 text-sm">{item.quantity}</td>
                                    <td className="px-3 py-3 text-right font-medium text-gray-600 text-sm">
                                        {item.variant.discountPrice != null && item.variant.discountPrice < item.variant.price ? (
                                            <>
                                                <span className="block text-gray-900 font-bold">৳{item.variant.discountPrice}</span>
                                                <span className="block text-[10px] text-gray-400 line-through">৳{item.variant.price}</span>
                                            </>
                                        ) : (
                                            <>৳{item.variant.price}</>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-right font-black text-gray-900 text-sm">৳{item.totalPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Footer / Summary */}
                    <div className="flex justify-between items-end">
                        <div className="space-y-3">
                            <div className="flex gap-2 items-center">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Payment: {order.paymentStatus}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-700 uppercase">Method: <span className="text-orange-600">{order.paymentMethod}</span></p>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Authorized Sultan Bazar Stamp</p>
                                <div className="h-12 w-32 mt-2 bg-gray-50 border border-dashed border-gray-200 rounded-lg"></div>
                            </div>
                        </div>
                        <div className="w-full max-w-sm space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <span>Subtotal</span>
                                <span>৳{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-widest">
                                <span>Shipping Charge</span>
                                <span>৳{order.shippingCharge ?? 0}</span>
                            </div>
                            {(order.discount ?? 0) > 0 && (
                                <div className="flex justify-between text-xs font-bold text-green-600 uppercase tracking-widest border-b border-gray-100 pb-2">
                                    <span>Discount{order.promotion?.code ? ` (${order.promotion.code})` : ""}</span>
                                    <span>-৳{order.discount}</span>
                                </div>
                            )}
                            {!(order.discount ?? 0) && <div className="border-b border-gray-100 pb-2" />}
                            <div className="flex justify-between items-center bg-orange-600 text-white p-3 rounded-xl">
                                <span className="text-xs font-black uppercase tracking-[0.2em]">Grand Total</span>
                                <span className="text-xl font-black tracking-tighter">৳{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">Thank you for buying from Sultan Bazar</p>
                    </div>
                </div>
            </div>,
            document.body
            )}

            {/* ─── Screen Modal (Screen Only) ─── */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 no-print"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-label={`Order ${order.orderNumber}`}
            >
                <div
                    className="bg-[#FAF7F2] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4 shrink-0 flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-xl font-bold text-gray-900" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                                    Order {order.orderNumber}
                                </h2>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[order.orderStatus]}`}>
                                    {order.orderStatus}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                                <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" aria-hidden="true" />{formatDate(order.createdAt || new Date().toISOString())}</span>
                                <span className="inline-flex items-center gap-1.5 uppercase"><CreditCard className="w-3.5 h-3.5" aria-hidden="true" />{order.paymentMethod}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#B5451B] hover:bg-[#9a3a16] text-white text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                            >
                                <Printer className="w-4 h-4" aria-hidden="true" />
                                Print invoice
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close order details"
                                className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                            >
                                <X className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto flex-1 p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] gap-6">
                            {/* Left: items + timeline */}
                            <div className="space-y-6 min-w-0">
                                <section className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                            <Package className="w-4 h-4 text-[#B5451B]" aria-hidden="true" />
                                            Items
                                        </h3>
                                        <span className="text-sm text-gray-500">{order.items.length} {order.items.length === 1 ? "product" : "products"}</span>
                                    </div>
                                    <ul className="divide-y divide-gray-100">
                                        {order.items.map((item, idx) => {
                                            const product = getPopulatedProduct(item.product);
                                            const name = product?.name || item.variant?.name || "Product";
                                            const hasDiscount = item.variant.discountPrice != null && item.variant.discountPrice < item.variant.price;
                                            return (
                                                <li key={idx} className="p-4 sm:p-5 flex items-center gap-4">
                                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden shrink-0">
                                                        {product?.thumbnail ? (
                                                            <Image src={product.thumbnail} alt={name} fill sizes="80px" className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center"><Package className="w-7 h-7 text-gray-300" aria-hidden="true" /></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-gray-900 leading-snug" style={{ overflowWrap: "break-word", minWidth: 0 }}>{name}</p>
                                                        <p className="mt-1 text-sm text-gray-500" style={{ overflowWrap: "break-word" }}>
                                                            {item.variant.name} — SKU {item.variant.sku}
                                                        </p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="font-bold text-gray-900">৳{item.totalPrice}</p>
                                                        <p className="mt-0.5 text-sm text-gray-500">
                                                            {item.quantity} × ৳{hasDiscount ? item.variant.discountPrice : item.variant.price}
                                                        </p>
                                                        {hasDiscount && (
                                                            <p className="text-xs text-gray-400 line-through">৳{item.variant.price}</p>
                                                        )}
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </section>

                                <section className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
                                        <Clock className="w-4 h-4 text-[#B5451B]" aria-hidden="true" />
                                        Order history
                                    </h3>
                                    <ol className="relative ml-2 border-l border-gray-200 space-y-5">
                                        {[...order.statusHistory].reverse().map((history, idx) => (
                                            <li key={idx} className="pl-5 relative">
                                                <span
                                                    className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${idx === 0 ? "bg-[#B5451B]" : "bg-gray-300"}`}
                                                    aria-hidden="true"
                                                />
                                                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                                                    <p className={`text-sm font-semibold capitalize ${idx === 0 ? "text-[#B5451B]" : "text-gray-700"}`}>{history.status}</p>
                                                    <span className="text-xs text-gray-500">{formatDate(history.changedAt || new Date().toISOString())}</span>
                                                </div>
                                                {history.note && <p className="mt-1 text-sm text-gray-600" style={{ overflowWrap: "break-word" }}>{history.note}</p>}
                                            </li>
                                        ))}
                                    </ol>
                                </section>
                            </div>

                            {/* Right: customer + payment */}
                            <div className="space-y-6 min-w-0">
                                <section className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <MapPin className="w-4 h-4 text-[#B5451B]" aria-hidden="true" />
                                        Ship to
                                    </h3>
                                    <p className="font-semibold text-gray-900" style={{ overflowWrap: "break-word", minWidth: 0 }}>{order.shippingAddress.fullName}</p>
                                    <a
                                        href={`tel:${order.shippingAddress.phone}`}
                                        className="inline-block mt-0.5 text-sm font-semibold text-[#B5451B] hover:underline underline-offset-2 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                                    >
                                        {order.shippingAddress.phone}
                                    </a>
                                    <p className="mt-3 text-sm text-gray-600 leading-relaxed" style={{ overflowWrap: "break-word" }}>
                                        {order.shippingAddress.address}
                                        <br />
                                        {order.shippingAddress.city}, {order.shippingAddress.district}
                                        {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ""}
                                    </p>
                                    {order.note && (
                                        <p className="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600" style={{ overflowWrap: "break-word" }}>
                                            <span className="font-semibold text-gray-900">Customer note: </span>{order.note}
                                        </p>
                                    )}
                                </section>

                                <section className="bg-white rounded-xl border border-gray-200 p-5">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                        <CreditCard className="w-4 h-4 text-[#B5451B]" aria-hidden="true" />
                                        Payment
                                    </h3>
                                    <dl className="space-y-2.5 text-sm">
                                        <div className="flex justify-between items-center">
                                            <dt className="text-gray-500">Method</dt>
                                            <dd className="font-semibold text-gray-900 uppercase">{order.paymentMethod}</dd>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <dt className="text-gray-500">Status</dt>
                                            <dd className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${PAYMENT_STATUS_COLORS[order.paymentStatus || "pending"]}`}>
                                                {order.paymentStatus || "pending"}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">Subtotal</dt>
                                            <dd className="font-semibold text-gray-900">৳{order.subtotal}</dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-gray-500">Shipping</dt>
                                            <dd className="font-semibold text-gray-900">৳{order.shippingCharge ?? 0}</dd>
                                        </div>
                                        {(order.discount ?? 0) > 0 && (
                                            <div className="flex justify-between text-green-700">
                                                <dt>Discount{order.promotion?.code ? ` (${order.promotion.code})` : ""}</dt>
                                                <dd className="font-semibold">-৳{order.discount}</dd>
                                            </div>
                                        )}
                                    </dl>
                                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-baseline justify-between">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="text-2xl font-extrabold text-[#B5451B]">৳{order.totalAmount}</span>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
