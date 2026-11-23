"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hydrateWishlist, removeFromWishlist, WishlistItem } from "@/redux/features/wishlistSlice";
import { addItemToLocalCart } from "@/redux/features/localCartSlice";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import { isLoggedIn } from "@/services/auth.services";

function WishlistCard({ item }: { item: WishlistItem }) {
    const dispatch = useAppDispatch();
    const [addToCart] = useAddToCartMutation();
    const [adding, setAdding] = useState(false);

    const handleAddToCart = async () => {
        setAdding(true);
        try {
            if (!isLoggedIn()) {
                dispatch(addItemToLocalCart({
                    product: { _id: item.productId, name: item.name, thumbnail: item.thumbnail, variants: [], tags: [], rating: 0, reviewCount: 0 } as never,
                    variant: { _id: item.variantId, name: item.variantName, price: item.price, stock: 99, isAvailable: true } as never,
                    quantity: 1,
                }));
                toast.success(`${item.name} added to cart!`);
            } else {
                await addToCart({ productId: item.productId, variantId: item.variantId, quantity: 1 }).unwrap();
                toast.success(`${item.name} added to cart!`);
            }
        } catch {
            toast.error("Failed to add to cart");
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-50 hover-lift flex flex-col">
            {/* Image */}
            <div className="relative h-[160px] bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                {item.thumbnail ? (
                    <Image src={item.thumbnail} alt={item.name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>
                )}
                {/* Remove from wishlist */}
                <button
                    onClick={() => dispatch(removeFromWishlist(item.productId))}
                    className="absolute top-2.5 right-2.5 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center transition-transform hover:scale-110"
                    title="Remove from wishlist"
                >
                    <Trash2 className="w-3.5 h-3.5" style={{ color: "#B5451B" }} />
                </button>
                {/* Wishlisted badge */}
                <div className="absolute top-2.5 left-2.5 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center">
                    <Heart className="w-3.5 h-3.5" fill="#B5451B" stroke="#B5451B" />
                </div>
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col flex-1">
                <Link href={`/shop/${item.productId}`}>
                    <h3 className="font-bengali font-bold text-gray-900 text-[13px] leading-tight line-clamp-1 mb-0.5 hover:text-[#B5451B] transition-colors">
                        {item.name}
                    </h3>
                </Link>
                <p className="text-[11px] text-gray-400 mb-2">{item.variantName}</p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-[15px]" style={{ color: "#B5451B" }}>৳{item.price}</span>
                    <button
                        onClick={handleAddToCart}
                        disabled={adding}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50"
                        style={{ background: "#B5451B", boxShadow: "0 3px 10px rgba(181,69,27,0.35)" }}
                    >
                        {adding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span className="text-lg font-bold leading-none">+</span>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function WishlistPage() {
    const dispatch = useAppDispatch();
    const items = useAppSelector(s => s.wishlist.items);

    useEffect(() => { dispatch(hydrateWishlist()); }, [dispatch]);

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center" style={{ background: "#FDF6EC" }}>
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-sm">
                    <Heart className="w-10 h-10 opacity-30" style={{ color: "#B5451B" }} />
                </div>
                <h1 className="font-bengali text-2xl font-bold text-gray-900 mb-2">উইশলিস্ট খালি</h1>
                <p className="font-bengali text-sm text-gray-500 mb-7">পছন্দের পণ্য হার্ট আইকনে ক্লিক করে সেভ করুন</p>
                <Link href="/shop">
                    <Button className="rounded-full px-8 py-5 font-bold text-white cursor-pointer" style={{ background: "#B5451B" }}>
                        পণ্য দেখুন <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 lg:py-12" style={{ background: "#FDF6EC" }}>
            <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="font-bengali text-2xl lg:text-3xl font-bold text-gray-900">
                            উইশলিস্ট
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">{items.length}টি পণ্য সেভ করা আছে</p>
                    </div>
                    <Link href="/shop" className="text-xs font-semibold flex items-center gap-1" style={{ color: "#B5451B" }}>
                        <ShoppingBag className="w-4 h-4" /> আরও কেনাকাটা
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-5">
                    {items.map(item => (
                        <WishlistCard key={item.productId} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
