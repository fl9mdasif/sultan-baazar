"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ShoppingCart, Heart, Star, ChevronRight, Minus, Plus,
    Truck, Shield, RotateCcw, Share2, CheckCircle, Tag, Loader2,
    Zap, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSingleProductQuery, useGetAllProductsQuery } from "@/redux/api/productApi";
import { useAddToCartMutation } from "@/redux/api/cartApi";
import { TProduct } from "@/types/common";
import { toast } from "sonner";
import { isLoggedIn } from "@/services/auth.services";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addItemToLocalCart } from "@/redux/features/localCartSlice";
import { toggleWishlist } from "@/redux/features/wishlistSlice";
import { Skeleton } from "@/components/ui/skeleton";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
    const s = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={s}
                    fill={i <= Math.round(rating) ? "#D4860A" : "none"}
                    stroke={i <= Math.round(rating) ? "#D4860A" : "#d1d5db"} />
            ))}
        </div>
    );
}

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: singleProduct, isLoading, isError } = useGetSingleProductQuery(id);
    const { data: products } = useGetAllProductsQuery({ limit: 4 });
    const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
    const dispatch = useAppDispatch();

    // console.log("singleProduct", singleProduct); // ok
    // console.log("all products", products); // ok

    const p = singleProduct as TProduct;

    const allProducts = products?.data?.filter((item: TProduct) => item._id !== id) || [];

    const [selectedVariantId, setSelectedVariantId] = useState<string>();
    const [activeImage, setActiveImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    const wishlistItems = useAppSelector(s => s.wishlist.items);
    const wished = wishlistItems.some(i => i.productId === id);

    const selectedVariant = p?.variants?.find((variant) => variant._id === selectedVariantId)
        ?? p?.variants?.find((variant) => variant.isAvailable && variant.stock > 0)
        ?? p?.variants?.[0]
        ?? null;

    if (isLoading) {
        return (
            <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
                <div className="border-b border-orange-100 bg-white">
                    <div className="container mx-auto px-4 lg:px-8 py-3">
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 mb-14">
                        <div className="space-y-3">
                            <Skeleton className="aspect-square w-full rounded-[2.5rem]" />
                            <div className="flex gap-4">
                                {[0,1,2,3].map(i => <Skeleton key={i} className="w-20 h-20 rounded-2xl flex-shrink-0" />)}
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-24 rounded-full" />
                                <Skeleton className="h-9 w-3/4" />
                                <Skeleton className="h-9 w-1/2" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-12 w-1/3" />
                            <div className="flex gap-3">
                                {[0,1,2].map(i => <Skeleton key={i} className="h-12 w-24 rounded-2xl" />)}
                            </div>
                            <div className="flex gap-3">
                                <Skeleton className="h-14 w-32 rounded-2xl" />
                                <Skeleton className="h-14 flex-1 rounded-2xl" />
                                <Skeleton className="h-14 flex-1 rounded-2xl" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[0,1,2].map(i => <Skeleton key={i} className="h-24 rounded-3xl" />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !p) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <div className="text-center p-8 bg-white rounded-3xl border border-red-100 shadow-sm">
                    <p className="text-red-500 font-bold mb-4">Oops! Product not found.</p>
                    <Link href="/products">
                        <Button style={{ background: "#B5451B" }}>Back to Collection</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!selectedVariant) return null;

    const price = selectedVariant.discountPrice ?? selectedVariant.price;
    const original = selectedVariant.price;
    const discount = selectedVariant.discountPrice
        ? Math.round(((original - selectedVariant.discountPrice) / original) * 100)
        : 0;
    const inStock = (selectedVariant.isAvailable ?? true) && selectedVariant.stock > 0;

    const handleAddToCart = async (redirect = false) => {
        if (!inStock || isAddingToCart) return;

        if (redirect) {
            // "Buy Now" — go straight to checkout with product params
            router.push(`/checkout?productId=${p._id}&variantId=${selectedVariant._id}&qty=${qty}`);
            return;
        }

        if (!isLoggedIn()) {
            // Guest: save to localStorage
            dispatch(addItemToLocalCart({ product: p, variant: selectedVariant, quantity: qty }));
            setAddedToCart(true);
            toast.success("Added to cart!");
            setTimeout(() => setAddedToCart(false), 2000);
            return;
        }

        try {
            await addToCart({
                productId: p._id,
                variantId: selectedVariant._id,
                quantity: qty
            }).unwrap();

            setAddedToCart(true);
            toast.success("Added to cart!");
            setTimeout(() => setAddedToCart(false), 2000);
        } catch (err: unknown) {
            const msg =
                typeof err === "object" && err !== null && "data" in err
                    ? (err as { data?: { message?: string } }).data?.message
                    : undefined;
            toast.error(msg ?? "Failed to add to cart");
        }
    };

    const handleShare = async () => {
        if (typeof window === "undefined") return;

        const currentUrl = window.location.href;
        const shareData = {
            title: p.name,
            text: `Check out this authentic ${p.name} from Sultan Bazar!`,
            url: currentUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } else {
                await navigator.clipboard.writeText(currentUrl);
                toast.success("Link copied to clipboard!");
            }
        } catch (err) {
            // Only show error if it's not a user cancellation
            if ((err as Error).name !== 'AbortError') {
                toast.error("Could not share product");
            }
        }
    };

    const gallery = p.gallery?.length ? p.gallery : [p.thumbnail];
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sultanbazar.com.bd";
    const productUrl = `${siteUrl}/products/${p.slug ?? p._id}`;
    const categoryName = typeof p.category === "object" ? p.category.name : String(p.category);
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.name,
        description: p.description,
        image: gallery,
        sku: selectedVariant.sku,
        brand: { "@type": "Brand", name: "Sultan Bazar" },
        offers: {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: "BDT",
            price: price,
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
        ...(p.rating && p.reviewCount ? {
            aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount },
        } : {}),
    };
    const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
            { "@type": "ListItem", position: 3, name: categoryName },
            { "@type": "ListItem", position: 4, name: p.name, item: productUrl },
        ],
    };

    return (
        <div className="min-h-screen" style={{ background: "#FAFAF8" }}>
            <link rel="canonical" href={productUrl} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

            {/* ── Breadcrumb ── */}
            <div className="border-b border-orange-100 bg-white">
                <div className="container mx-auto px-4 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <Link href="/" className="hover:text-[#B5451B] transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link href="/shop" className="hover:text-[#B5451B] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]">Shop</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="font-medium text-gray-700 truncate max-w-[180px]">{p.name}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-10">

                {/* ── Main Product Layout ── */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 mb-14">

                    {/* ── Left: Image Gallery ── */}
                    <div className="space-y-3">
                        {/* Main image */}
                        <div className="relative rounded-[2.5rem] overflow-hidden aspect-square bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm"
                            style={{ border: "1.5px solid #F0E6D3" }}>
                            {gallery[activeImage] ? (
                                <Image
                                    src={gallery[activeImage]}
                                    alt={p.name}
                                    fill
                                    className="object-cover transition-[transform,opacity] duration-300"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                    <Package className="w-20 h-20 text-gray-400" />
                                </div>
                            )}

                            {discount > 0 && (
                                <span className="absolute top-6 left-6 bg-green-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">
                                    -{discount}% OFF
                                </span>
                            )}
                            {p.isFeatured && (
                                <span className="absolute top-6 right-6 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg"
                                    style={{ background: "#B5451B" }}>BEST SELLER</span>
                            )}
                            {/* Wishlist */}
                            <button
                                onClick={() => {
                                    if (!p || !selectedVariant) return;
                                    dispatch(toggleWishlist({
                                        productId: p._id,
                                        name: p.name,
                                        thumbnail: p.thumbnail,
                                        price: selectedVariant.price,
                                        variantId: selectedVariant._id ?? "",
                                        variantName: selectedVariant.name,
                                    }));
                                }}
                                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                                className="absolute bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                            >
                                <Heart className="w-6 h-6" fill={wished ? "#B5451B" : "none"} stroke={wished ? "#B5451B" : "#9ca3af"} />
                            </button>
                        </div>

                        {/* Thumbnail strip */}
                        {gallery.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {gallery.map((img, i) => (
                                    <button key={i} onClick={() => setActiveImage(i)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-[border-color,opacity,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B] ${activeImage === i ? "border-[#B5451B] scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}>
                                        <Image src={img} alt="" width={80} height={80} className="object-cover w-full h-full" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Right: Product Info ── */}
                    <div className="space-y-8">
                        {/* Head */}
                        <div>
                            <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <Link
                                    href={`/shop?category=${typeof p.category === 'object' ? p.category._id : p.category}`}
                                    className="text-xs font-semibold px-4 py-1.5 rounded-full bg-white border border-orange-100 hover:bg-orange-50 transition-[background-color,color] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4860A]"
                                    style={{ color: "#D4860A" }}
                                >
                                    {typeof p.category === 'object' ? p.category.name : p.category}
                                </Link>
                                {p.tags?.map((t) => (
                                    <span key={t} className="text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase"
                                        style={{ background: "#B5451B15", color: "#B5451B" }}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black text-gray-900 leading-tight mb-4" style={{ overflowWrap: "break-word", minWidth: 0 }}>{p.name}</h1>
                            <div className="flex items-center gap-4 flex-wrap pb-6 border-b border-orange-100">
                                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-orange-50 shadow-sm">
                                    <Stars rating={p.rating ?? 0} size="sm" />
                                    <span className="text-sm text-gray-900 font-bold">{p.rating}</span>
                                </div>
                                <span className="text-xs text-gray-400">{p.reviewCount} Reviews</span>
                                <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${inStock ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                                    {inStock ? <><CheckCircle className="w-3 h-3" /> In Stock ({selectedVariant.stock})</> : "Out of Stock"}
                                </div>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col">
                                {selectedVariant.discountPrice && (
                                    <span className="text-sm text-gray-400 line-through font-bold">৳{original}</span>
                                )}
                                <span className="text-5xl font-black" style={{ color: "#B5451B" }}>৳{price}</span>
                            </div>
                            {discount > 0 && (
                                <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100">
                                    <p className="text-[10px] font-semibold text-[#D4860A] mb-0.5">Special Discount</p>
                                    <p className="text-sm font-black text-[#B5451B]">Save ৳{original - price}</p>
                                </div>
                            )}
                        </div>

                        {/* Variant selector */}
                        {p.variants.length > 1 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-gray-400">Select Options</p>
                                    <span className="text-xs font-bold text-gray-900">
                                        {selectedVariant.name} {selectedVariant.weight ? `(${selectedVariant.weight}g)` : ''}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {p.variants.map((v) => {
                                        const available = (v.isAvailable ?? true) && v.stock > 0;
                                        const active = v.sku === selectedVariant.sku;
                                        return (
                                            <button
                                                key={v.sku}
                                                disabled={!available}
                                                onClick={() => { setSelectedVariantId(v._id); setQty(1); }}
                                                className={`group relative px-6 py-3 rounded-2xl border-2 transition-[border-color,box-shadow,background-color] duration-200
                                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]
                                                    ${active ? "border-[#B5451B] bg-white ring-4 ring-[#B5451B]/10" : "border-gray-100 bg-white hover:border-orange-200"}
                                                    ${!available ? "opacity-30 cursor-not-allowed grayscale" : ""}
                                                `}
                                            >
                                                <div className="text-center">
                                                    <p className={`text-sm font-black ${active ? "text-[#B5451B]" : "text-gray-900"}`}>{v.name}</p>
                                                    <p className={`text-[10px] font-bold opacity-70 ${active ? "text-[#B5451B]" : "text-gray-400"}`}>৳{v.discountPrice ?? v.price}</p>
                                                </div>
                                                {active && (
                                                    <div className="absolute -top-2 -right-2 bg-[#B5451B] text-white rounded-full p-1 shadow-lg">
                                                        <CheckCircle className="w-3 h-3" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Actions */}
                        <div className="space-y-6 pt-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="flex items-center bg-white border-2 rounded-2xl p-1 shadow-sm h-14" style={{ borderColor: "#F0E6D3" }}>
                                    <button
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-orange-50 rounded-xl transition-[background-color] text-gray-900 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                                        disabled={qty <= 1}
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="w-14 text-center font-black text-lg text-gray-900">{qty}</span>
                                    <button
                                        onClick={() => setQty(Math.min(selectedVariant.stock, qty + 1))}
                                        disabled={qty >= selectedVariant.stock}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-orange-50 rounded-xl transition-[background-color] text-gray-900 disabled:opacity-30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
                                    <Button
                                        onClick={() => handleAddToCart(false)}
                                        disabled={!inStock || isAddingToCart}
                                        className="flex-1 text-white font-black rounded-2xl h-14 text-base flex items-center justify-center gap-2 transition-[background-color,transform,opacity] shadow-md active:scale-95 border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                                        style={{
                                            background: addedToCart ? "#22c55e" : inStock ? "#B5451B" : "#d1d5db"
                                        }}
                                    >
                                        {isAddingToCart ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : addedToCart ? (
                                            <><CheckCircle className="w-5 h-5" /> Added Successfully</>
                                        ) : (
                                            <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={() => handleAddToCart(true)}
                                        disabled={!inStock || isAddingToCart}
                                        className="flex-1 text-white font-black rounded-2xl h-14 text-base flex items-center justify-center gap-2 transition-[background-color,transform,opacity] shadow-xl active:scale-95 border border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                                        style={{
                                            background: inStock ? "linear-gradient(135deg, #D4860A, #B5451B)" : "#d1d5db"
                                        }}
                                    >
                                        <Zap className="w-5 h-5 fill-current" />
                                        Buy Now
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <p className="text-xs text-gray-400 flex items-center gap-2">
                                    <Tag className="w-4 h-4" /> SKU: <span className="text-gray-700 font-medium">{selectedVariant.sku}</span>
                                </p>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#B5451B] transition-[color] ml-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                                >
                                    <Share2 className="w-4 h-4" /> Share Product
                                </button>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {[
                                { icon: <Truck className="w-5 h-5" />, title: "Fast Shipping", sub: "Dhaka in 24h" },
                                { icon: <Shield className="w-5 h-5" />, title: "Secure Payment", sub: "SSL Encrypted" },
                                { icon: <RotateCcw className="w-5 h-5" />, title: "Easy Return", sub: "7 Day Policy" },
                            ].map((b) => (
                                <div key={b.title} className="bg-white rounded-3xl p-5 text-center border-2 border-orange-50 hover:border-orange-100 transition-[border-color] shadow-sm">
                                    <div className="flex justify-center mb-2 text-[#B5451B]">{b.icon}</div>
                                    <p className="text-xs font-semibold text-gray-900 mb-1">{b.title}</p>
                                    <p className="text-[10px] text-gray-400">{b.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Tabs Content ── */}
                <div className="bg-white rounded-[3rem] p-8 lg:p-16 mb-20 shadow-sm border border-orange-50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 opacity-20 rounded-full blur-3xl -mr-32 -mt-32" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 mb-8">
                            <div className="w-1.5 h-6 bg-[#B5451B] rounded-full" />
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Product Insights</h2>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Our Story & Quality Promise</h3>
                                <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed space-y-4">
                                    {p.description.split('\n').map((line, i) => (
                                        <p key={i}>{line}</p>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#FDF6EC] rounded-[2rem] p-8">
                                <h3 className="text-sm font-semibold text-[#B5451B] mb-6">Specifications</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-orange-100 pb-3">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Category</span>
                                        <span className="text-xs font-black text-gray-900 text-right">
                                            {typeof p.category === 'object' ? p.category.name : p.category}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-orange-100 pb-3">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Weight</span>
                                        <span className="text-xs font-black text-gray-900 text-right">{selectedVariant.weight}g</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-orange-100 pb-3">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Certification</span>
                                        <span className="text-xs font-black text-gray-900 text-right">BSTI Approved</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-500 uppercase">Origin</span>
                                        <span className="text-xs font-black text-gray-900 text-right">Bangladesh</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Related Products ── */}
                {allProducts.length > 0 && (
                    <section className="pb-20">
                        <div className="flex items-end justify-between mb-10">
                            <h2 className="text-3xl lg:text-4xl font-black text-gray-900">
                                Related <span style={{ color: "#B5451B" }}>Products</span>
                            </h2>
                            <Link href="/shop" className="text-sm font-semibold hover:text-[#B5451B] transition-[color] border-b-2 border-orange-100 pb-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]">
                                View All
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {allProducts.map((r: TProduct) => {
                                const relVariant = r.variants[0];
                                const relPrice = relVariant?.discountPrice ?? relVariant?.price ?? 0;
                                return (
                                    <Link key={r._id} href={`/shop/${r._id}`}
                                        className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-orange-50 transition-[box-shadow,border-color] hover:shadow-xl hover:border-[#F0E6D3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]">
                                        <div className="aspect-square relative bg-gradient-to-br from-amber-50 to-orange-50">
                                            {r.thumbnail ? (
                                                <Image src={r.thumbnail} alt={r.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                                    <Package className="w-10 h-10 text-gray-400" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <p className="text-sm font-black text-gray-900 line-clamp-2 mb-2 group-hover:text-[#B5451B] transition-colors h-10">{r.name}</p>
                                            <div className="flex items-center gap-2 mb-4">
                                                <Stars rating={r.rating ?? 0} />
                                                <span className="text-[10px] font-bold text-gray-400">({r.reviewCount})</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-black text-lg" style={{ color: "#B5451B" }}>৳{relPrice}</span>
                                                <Button size="icon" className="w-8 h-8 rounded-full bg-[#B5451B] text-white">
                                                    <ShoppingCart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}
