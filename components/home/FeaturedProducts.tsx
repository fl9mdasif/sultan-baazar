"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Star, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCardSkeleton } from "@/components/shared/skeletons";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { TProduct } from "@/types/common";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import { toast } from "sonner";
import { isLoggedIn } from "@/services/auth.services";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addItemToLocalCart } from "@/redux/features/localCartSlice";
import { hydrateWishlist, toggleWishlist } from "@/redux/features/wishlistSlice";

type ApiError = { data?: { message?: string } };
const getErrorMessage = (error: unknown, fallback: string) =>
    typeof error === "object" && error !== null && "data" in error
        ? ((error as ApiError).data?.message ?? fallback)
        : fallback;

function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star
                    key={i}
                    className="w-3.5 h-3.5"
                    fill={i <= Math.round(rating) ? "#D4860A" : "none"}
                    stroke={i <= Math.round(rating) ? "#D4860A" : "#ccc"}
                />
            ))}
        </div>
    );
}

function ProductCard({ product }: { product: TProduct }) {
    const [selectedVariantIndex] = useState(0);
    const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
    const [localAdding, setLocalAdding] = useState(false);
    const dispatch = useAppDispatch();
    const wishlistItems = useAppSelector(s => s.wishlist.items);
    const wishlisted = wishlistItems.some(i => i.productId === product._id);

    const variant = product.variants[selectedVariantIndex];
    if (!variant) return null;

    const price = variant.discountPrice ?? variant.price;
    const originalPrice = variant.price;
    const hasDiscount = !!variant.discountPrice;
    const discount = hasDiscount
        ? Math.round(((originalPrice - (variant.discountPrice ?? 0)) / originalPrice) * 100)
        : 0;

    const inStock = (variant.isAvailable ?? true) && variant.stock > 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn()) {
            // Guest: save to localStorage cart
            setLocalAdding(true);
            dispatch(addItemToLocalCart({ product, variant, quantity: 1 }));
            toast.success(`${product.name} added to cart!`);
            setTimeout(() => setLocalAdding(false), 600);
            return;
        }

        try {
            await addToCart({
                productId: product._id,
                variantId: variant._id,
                quantity: 1
            }).unwrap();
            toast.success(`${product.name} added to cart!`);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to add to cart"));
        }
    };

    const adding = isAdding || localAdding;

    return (
        <Link href={`/shop/${product._id}`}>
            <div
                className="hover-lift bg-white rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer group"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
            >
                {/* Image area */}
                <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
                    {product.thumbnail ? (
                        <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-300" aria-hidden="true" />
                        </div>
                    )}

                    {/* Wishlist */}
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); dispatch(toggleWishlist({ productId: product._id, name: product.name, thumbnail: product.thumbnail, price, variantId: variant._id ?? "", variantName: variant.name ?? "" })); }}
                        className="absolute top-2.5 right-2.5 z-10 w-7 h-7 bg-white rounded-full shadow-sm flex items-center justify-center transition-transform hover:scale-110"
                    >
                        <Heart
                            className="w-3.5 h-3.5"
                            fill={wishlisted ? "#B5451B" : "none"}
                            stroke={wishlisted ? "#B5451B" : "#9ca3af"}
                        />
                    </button>

                    {/* Discount badge */}
                    {discount > 0 && (
                        <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-green-500 text-white">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-bengali font-bold text-gray-900 text-[13px] leading-tight line-clamp-1 mb-0.5">
                        {product.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-tight mb-2 line-clamp-1">
                        {product.tags?.[0] || "Fresh & Natural"}
                    </p>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-2">
                        <Stars rating={product.rating ?? 0} />
                        <span className="text-[10px] text-gray-400">({product.reviewCount ?? 0})</span>
                    </div>

                    {/* Price + Add button */}
                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            <span className="text-[15px] font-bold" style={{ color: "#B5451B" }}>
                                ৳{price}
                            </span>
                            {hasDiscount && (
                                <span className="text-[11px] text-gray-400 line-through ml-1">
                                    ৳{originalPrice}
                                </span>
                            )}
                        </div>

                        {/* Circular + button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={!inStock || adding}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95 cursor-pointer disabled:opacity-50 flex-shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
                            style={{ background: "#B5451B", boxShadow: "0 3px 10px rgba(181,69,27,0.35)" }}
                        >
                            {adding ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <span className="text-lg font-bold leading-none">+</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function FeaturedProducts() {
    const dispatch = useAppDispatch();
    useEffect(() => { dispatch(hydrateWishlist()); }, [dispatch]);
    const { data, isLoading, isError } = useGetAllProductsQuery({ isFeatured: true, limit: 8 });

    // console.log('fp', data);
    const products = data?.data || [];

    if (isLoading) {
        return (
            <section className="py-6 lg:py-12" style={{ background: "#FDF6EC" }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="h-5 w-24 rounded bg-gray-200/80 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-gray-200/80 animate-pulse" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            </section>
        );
    }

    if (isError) {
        return (
            <section className="py-12 lg:py-20 bg-red-50/30">
                <div className="container mx-auto px-4 text-center">
                    <div className="py-12 bg-white rounded-3xl border border-red-100 shadow-sm max-w-md mx-auto">
                        <p className="text-red-500 font-medium">Oops! Failed to load products.</p>
                        <Button
                            variant="link"
                            className="mt-2 text-[#B5451B]"
                            onClick={() => window.location.reload()}
                        >
                            Try refreshing
                        </Button>
                    </div>
                </div>
            </section>
        );
    }

    const cardContainer = {
        hidden: {},
        show: { transition: { staggerChildren: 0.07 } },
    } as const;
    const cardItem = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
    };

    return (
        <section className="py-6 lg:py-12" style={{ background: "#FDF6EC" }}>
            <div>
                {/* Mobile section header */}
                {/* lg: centered headline + description with View All right-aligned */}
                <motion.div
                    className="hidden lg:flex lg:items-center lg:justify-between lg:mb-6"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="flex-1 text-center min-w-0">
                        <h2
                            className="text-3xl font-black text-gray-900 mb-2"
                            style={{ overflowWrap: "break-word", minWidth: 0 }}
                        >
                            Our{" "}
                            <span style={{ color: "var(--brand-primary)" }}>Best Sellers</span>
                        </h2>
                        <p className="text-sm text-gray-500 mx-auto max-w-md" style={{ overflowWrap: "break-word" }}>
                            Top-rated products loved by our customers — tried, trusted, and ordered again and again.
                        </p>
                    </div>
                    <Link
                        href="/shop"
                        className="flex-shrink-0 text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] rounded"
                        style={{ color: "var(--brand-primary)" }}
                    >
                        View All
                    </Link>
                </motion.div>

                {/* mobile: simple row */}
                <motion.div
                    className="flex items-center justify-between mb-4 lg:hidden"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="font-bengali text-[18px] font-bold text-gray-900">Best Seller</h2>
                    <Link
                        href="/shop"
                        className="text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] rounded"
                        style={{ color: "var(--brand-primary)" }}
                    >
                        View All
                    </Link>
                </motion.div>

                {products.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 italic text-sm">
                        No featured products available.
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6"
                        variants={cardContainer}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.1 }}
                    >
                        {products.map((p: TProduct) => (
                            <motion.div key={p._id} variants={cardItem}>
                                <ProductCard product={p} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                <div className="text-center mt-6 lg:mt-10 hidden lg:block">
                    <Link href="/shop">
                        <Button
                            size="lg"
                            className="rounded-full px-12 font-bold text-white shadow-xl transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
                            style={{ background: "linear-gradient(135deg, var(--brand-primary), var(--brand-gold))" }}
                        >
                            Explore Full Collection
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
