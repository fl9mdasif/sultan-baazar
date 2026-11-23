"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCardSkeleton } from "@/components/shared/skeletons";
import { useGetAllProductsQuery } from "@/redux/api/productApi";
import { TProduct } from "@/types/common";
import { Loader2, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export default function HealthProducts() {
    const router = useRouter();
    // We fetch a larger limit to ensure we find enough tagged products locally
    const { data, isLoading, isError } = useGetAllProductsQuery({ limit: 6 });
    const allProducts = data?.data || [];

    // Filter by tag "health" (case-insensitive)
    const products = allProducts.filter((p: TProduct) =>
        p.tags?.some(tag => tag.toLowerCase() === "health")
    );

    if (isLoading) {
        return (
            <section className="py-6 lg:py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="h-5 w-32 rounded bg-gray-200/80 animate-pulse" />
                        <div className="h-4 w-16 rounded bg-gray-200/80 animate-pulse" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || products.length === 0) {
        return null; // Don't show the section if there's an error or no products
    }

    const handleShop = (id: string) => {
        // if (!isLoggedIn()) {
        //     toast.error("Please login to see product details");
        //     router.push(`/login?from=/products/${id}`);
        //     return;
        // }
        router.push(`/shop/${id}`);
    };

    const cardContainer = {
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
    } as const;
    const cardItem = {
        hidden: { opacity: 0, y: 24 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
    };

    return (
        <section className="py-12 lg:py-20 bg-white overflow-hidden">
            <div>
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="font-bengali text-3xl lg:text-5xl font-black text-gray-900 tracking-tight">
                        প্রকৃতির <span style={{ color: "#B5451B" }}>সেরা উপহার</span>
                    </h2>
                    <p className="text-gray-500 mt-6 max-w-xl mx-auto text-sm lg:text-base leading-relaxed">
                        Health-focused natural products curated for your holistic wellbeing and daily nourishment.
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
                    variants={cardContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {products.slice(0, 3).map((p: TProduct, idx: number) => {
                        const variant = p.variants[0];
                        const price = variant?.discountPrice ?? variant?.price ?? 0;
                        const colors = [
                            "from-green-50 to-emerald-50",
                            "from-purple-50 to-violet-50",
                            "from-blue-50 to-cyan-50"
                        ];
                        const accents = ["#16a34a", "#7c3aed", "#0891b2"];

                        return (
                            <motion.div
                                key={p._id}
                                variants={cardItem}
                                className="group hover-lift rounded-[2.5rem] overflow-hidden border bg-white shadow-sm transition-shadow hover:shadow-xl cursor-pointer"
                                style={{ border: "1.5px solid #F0E6D3" }}
                            >
                                {/* Image area */}
                                <div className={`relative bg-gradient-to-br ${colors[idx % 3]} h-64 flex items-center justify-center overflow-hidden`}>
                                    {p.thumbnail ? (
                                        <Image
                                            src={p.thumbnail}
                                            alt={p.name}
                                            fill
                                            className="object-contain p-8 group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <Leaf className="w-16 h-16 opacity-20 text-green-500" aria-hidden="true" />
                                    )}
                                    <div className="absolute top-6 right-6">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm"
                                            style={{ color: accents[idx % 3] }}
                                        >
                                            <Leaf className="w-6 h-6" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-bengali font-black text-gray-900 text-xl leading-tight mb-1">
                                                {p.name}
                                            </h3>
                                            <p className="text-gray-400 text-xs font-medium">{p.slug.replace(/-/g, ' ')}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-500 leading-relaxed  line-clamp-3 min-h-[4.5rem]">
                                        {/* {p.description} */}

                                        {p.description.length > 90 ? p.description.slice(0, 90) + "..." : p.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-orange-50">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 mb-1">Starting from</span>
                                            <span className="text-2xl font-black" style={{ color: "#B5451B" }}>
                                                ৳{price}
                                            </span>
                                        </div>
                        <Button
                            key={p._id}
                                            onClick={() => handleShop(p._id)}
                                            size="lg"
                                            className="rounded-xl text-white font-bold px-8 shadow-lg transition-[box-shadow] active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]"
                                            style={{ background: "var(--brand-primary)" }}
                                        >
                                            Shop
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
