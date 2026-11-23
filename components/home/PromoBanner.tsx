"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useGetPromotionsQuery } from "@/redux/api/promotionApi";

const FALLBACK = { code: "SULTAN10", value: 10, type: "percentage" as const };

export default function PromoBanner() {
    const { data: promos } = useGetPromotionsQuery(undefined, {});
    const promo = (promos && promos.length > 0) ? promos[0] : FALLBACK;
    const displayValue = promo.type === "percentage" ? `${promo.value}%` : `৳${promo.value}`;

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(promo.code).then(() => {
            setCopied(true);
            toast.success("Coupon code copied!");
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
        {/* ── Announcement strip ── */}
        <div
            className="shimmer relative w-full py-3 text-white overflow-hidden"
            style={{ background: "linear-gradient(90deg, var(--brand-primary), var(--brand-gold), var(--brand-primary))" }}
        >
            <div className="flex items-center justify-center gap-3 px-4 text-center">
                <p className="text-xs md:text-sm font-semibold">
                    Free Delivery on orders above{" "}
                    <span className="font-extrabold text-yellow-300">৳1,000</span>
                    <span className="hidden sm:inline">
                        {" "}— Use code{" "}
                        <span className="font-extrabold text-yellow-300">{promo.code}</span>
                        {" "}for {displayValue} off your first order
                    </span>
                </p>
            </div>
        </div>

        {/* ── Promo card ── */}
        <section className="py-6 lg:py-10" style={{ background: "var(--brand-cream)" }}>
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    className="shimmer relative rounded-3xl overflow-hidden flex items-center gap-4 md:gap-8 p-6 md:p-10"
                    style={{
                        background: "linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-dark) 100%)",
                        boxShadow: "0 6px 28px rgba(181,69,27,0.35)",
                    }}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Dot pattern overlay */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        aria-hidden="true"
                        style={{ opacity: 0.13 }}
                    >
                        <defs>
                            <pattern id="promo-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="2" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#promo-dots)" />
                    </svg>

                    {/* Left content */}
                    <div className="flex-1 min-w-0 relative z-10">
                        <h2
                            className="text-2xl md:text-4xl font-black text-white leading-none mb-4"
                            style={{ overflowWrap: "break-word", minWidth: 0 }}
                        >
                            SAVE <span style={{ color: "var(--brand-gold-light)" }}>{displayValue}</span> TODAY
                        </h2>

                        {/* Voucher copy row */}
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                            <span className="text-xs text-white/70 font-medium">Use voucher</span>
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-md transition-[opacity,transform] hover:opacity-80 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                style={{ color: "var(--brand-gold-light)", border: "1.5px dashed var(--brand-gold-light)" }}
                                aria-label={`Copy coupon code ${promo.code}`}
                            >
                                {promo.code}
                                {copied
                                    ? <Check className="w-3 h-3" />
                                    : <Copy className="w-3 h-3" />
                                }
                            </button>
                        </div>

                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full transition-[opacity,transform] hover:opacity-90 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            style={{ background: "white", color: "var(--brand-primary)" }}
                        >
                            Shop the offer
                        </Link>
                    </div>

                    {/* Badge */}
                    <div
                        className="flex-shrink-0 w-20 h-20 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center relative z-10"
                        style={{
                            background: "var(--brand-gold-light)",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                        }}
                    >
                        <span className="text-xl md:text-3xl font-black leading-none" style={{ color: "var(--brand-primary-dark)" }}>{displayValue}</span>
                        <span className="text-[10px] md:text-xs font-bold" style={{ color: "var(--brand-primary-dark)" }}>OFF</span>
                    </div>
                </motion.div>
            </div>
        </section>
        </>
    );
}
