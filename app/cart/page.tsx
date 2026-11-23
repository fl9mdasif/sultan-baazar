"use client";

import { useMemo } from "react";
import { Trash2, ShoppingBag, ArrowRight, Loader2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { QueryErrorState } from "@/components/shared/QueryErrorState";
import { QuantityControl } from "@/components/cart/QuantityControl";
import { toast } from "sonner";

// Remote cart (logged-in)
import { useGetCartQuery, useUpdateQuantityMutation, useRemoveFromCartMutation } from "@/redux/api/cartApi";
import { TCart, TCartItem } from "@/types/common";
import { isLoggedIn } from "@/services/auth.services";

// Local cart (guest)
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    updateLocalCartQty,
    removeItemFromLocalCart,
    LocalCartItem,
} from "@/redux/features/localCartSlice";

type ApiError = { data?: { message?: string } };
const getErrorMessage = (error: unknown, fallback: string) =>
    typeof error === "object" && error !== null && "data" in error
        ? ((error as ApiError).data?.message ?? fallback)
        : fallback;

// ── Remote Cart Item (logged-in) ─────────────────────────────────────────────
function RemoteCartItemRow({ item }: { item: TCartItem }) {
    const [updateQuantity, { isLoading: isUpdating }] = useUpdateQuantityMutation();
    const [remove, { isLoading: isRemoving }] = useRemoveFromCartMutation();

    const variant = useMemo(() => {
        return item.product.variants.find(v => v._id === item.variantId || v.sku === item.variantId);
    }, [item.product.variants, item.variantId]);

    if (!variant) return null;

    const price = variant.discountPrice ?? variant.price;
    const subtotal = price * item.quantity;

    const handleUpdateQuantity = async (newQty: number) => {
        if (newQty < 1) return;
        if (newQty > variant.stock) { toast.error("Not enough stock available"); return; }
        try {
            await updateQuantity({ productId: item.product._id, variantId: variant._id, quantity: newQty }).unwrap();
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to update quantity"));
        }
    };

    const handleRemove = async () => {
        try {
            await remove({ productId: item.product._id, variantId: variant._id }).unwrap();
            toast.success("Item removed from cart");
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to remove item"));
        }
    };

    return (
        <>
            {/* ── Mobile card ──────────────────────────────────────────── */}
            <div className="sm:hidden bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
                <div className="flex gap-3">
                    <div className="relative w-[76px] h-[76px] rounded-xl overflow-hidden border border-orange-100 bg-orange-50 flex-shrink-0">
                        <Image src={item.product.thumbnail || "/placeholder-product.png"} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                            <Link href={`/shop/${item.product._id}`} className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{item.product.name}</h3>
                            </Link>
                            <span className="font-black text-sm text-gray-900 flex-shrink-0">৳{subtotal}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-auto">{variant.name}</p>
                        <div className="flex items-center justify-between pt-2.5">
                            <QuantityControl quantity={item.quantity} stock={variant.stock} loading={isUpdating} onChange={handleUpdateQuantity} />
                            <button onClick={handleRemove} disabled={isRemoving}
                                className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-[background-color,color] disabled:opacity-50 cursor-pointer"
                                title="Remove item">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Desktop row ───────────────────────────────────────────── */}
            <div className="hidden sm:grid grid-cols-12 gap-4 items-center py-5 border-b border-orange-100 last:border-0 group hover:bg-orange-50/20 transition-colors rounded-xl px-2 -mx-2">
                <div className="col-span-6 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-orange-100 bg-white shadow-sm flex-shrink-0">
                        <Image src={item.product.thumbnail || "/placeholder-product.png"} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                        <Link href={`/shop/${item.product._id}`} className="inline-block group-hover:text-[#B5451B] transition-colors">
                            <h3 className="font-bold text-gray-900 text-base leading-tight mb-0.5 line-clamp-2">{item.product.name}</h3>
                        </Link>
                        <p className="text-xs font-semibold text-[#B5451B]">{variant.name}</p>
                    </div>
                </div>
                <div className="col-span-3 flex justify-center">
                    <QuantityControl quantity={item.quantity} stock={variant.stock} loading={isUpdating} onChange={handleUpdateQuantity} />
                </div>
                <div className="col-span-3 flex items-center justify-end gap-3">
                    <span className="font-black text-gray-900 text-lg">৳{subtotal}</span>
                    <button onClick={handleRemove} disabled={isRemoving} className="text-[#B5451B] hover:text-[#8F3514] p-1 transition-colors disabled:opacity-50 cursor-pointer" title="Remove item">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Local Cart Item (guest) ──────────────────────────────────────────────────
function LocalCartItemRow({ item }: { item: LocalCartItem }) {
    const dispatch = useAppDispatch();

    const subtotal = item.price * item.quantity;

    const handleQty = (newQty: number) => {
        if (newQty < 1) return;
        if (newQty > item.stock) { toast.error("Not enough stock available"); return; }
        dispatch(updateLocalCartQty({ productId: item.productId, variantId: item.variantId, quantity: newQty }));
    };

    const handleRemove = () => {
        dispatch(removeItemFromLocalCart({ productId: item.productId, variantId: item.variantId }));
        toast.success("Item removed from cart");
    };

    return (
        <>
            {/* ── Mobile card ──────────────────────────────────────────── */}
            <div className="sm:hidden bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
                <div className="flex gap-3">
                    <div className="relative w-[76px] h-[76px] rounded-xl overflow-hidden border border-orange-100 bg-orange-50 flex-shrink-0">
                        <Image src={item.productThumbnail || "/placeholder-product.png"} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                            <Link href={`/shop/${item.productId}`} className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{item.productName}</h3>
                            </Link>
                            <span className="font-black text-sm text-gray-900 flex-shrink-0">৳{subtotal}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-auto">{item.variantName}</p>
                        <div className="flex items-center justify-between pt-2.5">
                            <QuantityControl quantity={item.quantity} stock={item.stock} onChange={handleQty} />
                            <button onClick={handleRemove}
                                className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 hover:text-red-600 transition-[background-color,color] cursor-pointer"
                                title="Remove item">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Desktop row ───────────────────────────────────────────── */}
            <div className="hidden sm:grid grid-cols-12 gap-4 items-center py-5 border-b border-orange-100 last:border-0 group hover:bg-orange-50/20 transition-colors rounded-xl px-2 -mx-2">
                <div className="col-span-6 flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-orange-100 bg-white shadow-sm flex-shrink-0">
                        <Image src={item.productThumbnail || "/placeholder-product.png"} alt={item.productName} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                        <Link href={`/shop/${item.productId}`} className="inline-block group-hover:text-[#B5451B] transition-colors">
                            <h3 className="font-bold text-gray-900 text-base leading-tight mb-0.5 line-clamp-2">{item.productName}</h3>
                        </Link>
                        <p className="text-xs font-semibold text-[#B5451B]">{item.variantName}</p>
                    </div>
                </div>
                <div className="col-span-3 flex justify-center">
                    <QuantityControl quantity={item.quantity} stock={item.stock} onChange={handleQty} />
                </div>
                <div className="col-span-3 flex items-center justify-end gap-3">
                    <span className="font-black text-gray-900 text-lg">৳{subtotal}</span>
                    <button onClick={handleRemove} className="text-[#B5451B] hover:text-[#8F3514] p-1 transition-colors cursor-pointer" title="Remove item">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    );
}

// ── Shared cart layout ───────────────────────────────────────────────────────
function CartLayout({
    items,
    subtotal,
    renderItems,
}: {
    items: { length: number };
    subtotal: number;
    renderItems: () => React.ReactNode;
}) {

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-[#B5451B] opacity-50" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                <p className="text-gray-500 mb-8 max-w-xs text-center">Looks like you haven&apos;t added anything yet. Let&apos;s find something amazing for you!</p>
                <Link href="/shop">
                    <Button className="rounded-full px-8 py-6 text-base font-semibold group cursor-pointer" style={{ background: "#B5451B" }}>
                        Start Shopping <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAF8] py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <Link href="/shop" className="inline-flex items-center text-sm font-semibold text-[#B5451B] hover:gap-2 transition-all gap-1 mb-4">
                            <ChevronLeft className="w-4 h-4" /> Back to Products
                        </Link>
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Shopping <span style={{ color: "#B5451B" }}>Cart</span></h1>
                        <p className="text-gray-500 font-medium">{items.length} items waiting for you</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10 items-start">
                    <div className="flex-1 w-full sm:bg-white sm:rounded-3xl sm:p-8 sm:border sm:border-orange-100 sm:shadow-sm">
                        <div className="hidden sm:grid grid-cols-12 gap-4 pb-4 border-b border-orange-100 text-xs font-semibold text-gray-400">
                            <div className="col-span-6">Product Details</div>
                            <div className="col-span-3 text-center">Quantity</div>
                            <div className="col-span-3 text-right">Subtotal</div>
                        </div>
                        <div className="flex flex-col gap-3 sm:gap-0">{renderItems()}</div>
                    </div>

                    <aside className="w-full lg:w-[380px] shrink-0 sticky top-24">
                        <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-orange-100 bg-orange-50/20">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-gray-600 font-medium"><span>Subtotal</span><span className="text-gray-900 font-bold">৳{subtotal}</span></div>
                                    {/* <div className="flex justify-between text-gray-600 font-medium"><span>Shipping Charge</span><span className="text-gray-900 font-bold">Calculated at checkout</span></div> */}
                                    <div className="flex justify-between text-gray-600 font-medium"><span>Estimated Tax</span><span className="text-gray-900 font-bold">৳0</span></div>
                                </div>
                            </div>
                            <div className="p-8 bg-white">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-lg font-bold text-gray-900">Total Amount</span>
                                    <span className="text-3xl font-black" style={{ color: "#B5451B" }}>৳{subtotal}</span>
                                </div>
                                <Link href="/checkout">
                                    <Button className="w-full py-7 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] group cursor-pointer" style={{ background: "#B5451B" }}>
                                        Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                    Secure SSL Encrypted Checkout
                                </div>
                            </div>
                        </div>

                        {/* coupon */}
                        {/* <div className="mt-4 p-6 bg-white rounded-3xl border border-orange-100 shadow-sm">
                            <label className="block text-sm font-bold text-gray-700 mb-3">Optional: Promo Code</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder="Enter code" className="flex-1 bg-gray-50 border border-orange-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B5451B] transition-colors" />
                                <Button variant="outline" className="rounded-xl border-[#B5451B] text-[#B5451B] font-bold cursor-pointer">Apply</Button>
                            </div>
                        </div> */}
                    </aside>
                </div>
            </div>
        </div>
    );
}

// ── Remote Cart Page (logged-in) ─────────────────────────────────────────────
function RemoteCartPage() {
    const { data: cartData, isLoading, isError, refetch } = useGetCartQuery({});
    const cart = cartData as TCart | undefined;

    const subtotal = useMemo(() =>
        (cart?.items ?? []).reduce((acc, item) => {
            const variant = item.product.variants.find(v => v._id === item.variantId || v.sku === item.variantId);
            const price = variant?.discountPrice ?? variant?.price ?? 0;
            return acc + (price * item.quantity);
        }, 0),
    [cart?.items]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
                    <p className="text-gray-500 font-medium">Preparing your cart...</p>
                </div>
            </div>
        );
    }
    if (isError) {
        return <div className="min-h-screen bg-[#FAFAF8] p-6"><QueryErrorState message="Your cart could not be loaded." onRetry={refetch} /></div>;
    }

    const items = cart?.items || [];
    return (
        <CartLayout
            items={items}
            subtotal={subtotal}
            renderItems={() => items.map((item, idx) => (
                <RemoteCartItemRow key={`${item.product._id}-${item.variantId}-${idx}`} item={item} />
            ))}
        />
    );
}

// ── Local Cart Page (guest) ──────────────────────────────────────────────────
function LocalCartPage() {
    const items = useAppSelector((state) => state.localCart.items);

    const subtotal = useMemo(() => {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }, [items]);

    return (
        <CartLayout
            items={items}
            subtotal={subtotal}
            renderItems={() => items.map((item) => (
                <LocalCartItemRow key={`${item.productId}-${item.variantId}`} item={item} />
            ))}
        />
    );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function CartPage() {
    if (isLoggedIn()) {
        return <RemoteCartPage />;
    }
    return <LocalCartPage />;
}
