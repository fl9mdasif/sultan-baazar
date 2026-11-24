"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import { TCategory } from "@/types/common";
import Image from "next/image";
import {
    ChevronLeft, ChevronRight,
    Carrot, Wheat, Droplets, Spline, UtensilsCrossed,
    Cookie, Coffee, Leaf, Package, Bean, Flame, Tag
} from "lucide-react";
import { CategoryPillSkeleton } from "@/components/shared/skeletons";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const SLUG_ICONS: Record<string, LucideIcon> = {
    "vegetables":    Carrot,
    "rice-grains":   Wheat,
    "oils":          Droplets,
    "spice-powders": Spline,
    "masala-mixes":  UtensilsCrossed,
    "snacks":        Cookie,
    "beverages":     Coffee,
    "tea":           Leaf,
    "dry-foods":     Package,
    "pulses-seeds":  Bean,
    "whole-spices":  Flame,
    "offers":        Tag,
};

export default function Categories() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const { data: categoryData, isLoading } = useGetAllCategoriesQuery({});
    const categories: TCategory[] = categoryData || [];
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (dir: "left" | "right") =>
        scrollRef.current?.scrollBy({ left: dir === "left" ? -220 : 220, behavior: "smooth" });

    if (isLoading) {
        return (
            <section className="pt-5 pb-1" style={{ background: "var(--brand-cream)" }}>
                <div className="flex items-center justify-between mb-3">
                    <div className="h-4 w-24 rounded bg-gray-200/80 animate-pulse" />
                    <div className="h-3 w-14 rounded bg-gray-200/80 animate-pulse" />
                </div>
                <div className="flex gap-4 lg:gap-6 overflow-hidden">
                    {Array.from({ length: 7 }).map((_, i) => <CategoryPillSkeleton key={i} />)}
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="pt-5 pb-1" style={{ background: "var(--brand-cream)" }}>
            {/* lg-only section headline */}
            <motion.div
                className="hidden lg:flex lg:items-center lg:justify-between lg:mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="flex-1 text-center min-w-0">
                    <h2
                        className="text-3xl font-black text-gray-900 mb-2"
                        style={{ overflowWrap: "break-word", minWidth: 0 }}
                    >
                        Browse by{" "}
                        <span style={{ color: "var(--brand-primary)" }}>Category</span>
                    </h2>
                    <p className="text-sm text-gray-500 mx-auto max-w-md" style={{ overflowWrap: "break-word" }}>
                        Explore our full range of authentic Bangladeshi spices, oils, and cooking essentials — sorted for easy discovery.
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

            <motion.div
                className="flex items-center justify-between mb-3 lg:hidden"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h2 className="text-[17px] font-bold text-gray-900">Categories</h2>
                <Link
                    href="/shop"
                    className="text-xs font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] rounded"
                    style={{ color: "var(--brand-primary)" }}
                >
                    View All
                </Link>
            </motion.div>
            <motion.div
                className="relative"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-orange-100 flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-4 h-4" style={{ color: "var(--brand-primary)" }} />
                </button>
                <div
                    ref={scrollRef}
                    className="flex justify-center gap-4 lg:gap-6 overflow-x-auto pb-2 px-9"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                {categories.map((cat) => {
                    const isActive = activeId === cat._id;
                    const FallbackIcon = SLUG_ICONS[cat.slug] ?? Package;

                    return (
                        <Link
                            key={cat._id}
                            href={`/shop?category=${encodeURIComponent(cat.name)}`}
                            className="flex-shrink-0 flex flex-col items-center gap-1.5 lg:gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)] rounded-xl"
                            onClick={() => setActiveId(cat._id)}
                        >
                            <div
                                className="w-[68px] h-[68px] lg:w-32 lg:h-32 rounded-xl overflow-hidden flex items-center justify-center transition-[background-color,border-color,box-shadow] duration-200 relative"
                                style={
                                    isActive
                                        ? {
                                              background: "var(--brand-primary)",
                                              boxShadow: "0 4px 14px rgba(181,69,27,0.35)",
                                              border: "2px solid var(--brand-primary-dark)",
                                          }
                                        : {
                                              background: "rgba(181,69,27,0.08)",
                                              boxShadow: "0 4px 14px rgba(0,0,0,0.10)",
                                              border: "2px solid transparent",
                                          }
                                }
                            >
                                {cat.thumbnail ? (
                                    <Image
                                        src={cat.thumbnail}
                                        alt={cat.name}
                                        fill
                                        className="object-cover"
                                        style={isActive ? { opacity: 0.85 } : {}}
                                    />
                                ) : (
                                    <FallbackIcon
                                        className="w-7 h-7 lg:w-12 lg:h-12"
                                        style={{ color: isActive ? "#fff" : "var(--brand-primary)" }}
                                        aria-hidden="true"
                                    />
                                )}
                            </div>
                            <span
                                className="text-[11px] lg:text-base font-semibold whitespace-nowrap"
                                style={{ color: isActive ? "var(--brand-primary)" : "#1A1A1A" }}
                            >
                                {cat.name}
                            </span>
                        </Link>
                    );
                })}
                </div>
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white shadow-md border border-orange-100 flex items-center justify-center cursor-pointer hover:bg-orange-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-4 h-4" style={{ color: "var(--brand-primary)" }} />
                </button>
            </motion.div>
        </section>
    );
}
