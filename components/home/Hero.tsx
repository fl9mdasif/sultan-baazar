"use client";

import Image from "next/image";
import Link from "next/link";
import { Truck, Leaf, Wallet, Star } from "lucide-react";
import { TrustedAvatars } from "@/components/shared/TrustedAvatars";

const BRAND = "#B5451B";
const BRAND_TINT = "rgba(181,69,27,0.12)";

const bottomItems = [
    { Icon: Star, title: "৪.৯/৫ রেটিং", sub: "১২,০০০+ গ্রাহক" },
    { Icon: Wallet, title: "ক্যাশ অন ডেলিভারি", sub: "ঘরে এসে পেমেন্ট" },
    { Icon: Leaf, title: "১০০% খাঁটি পণ্য", sub: "ভেজালমুক্ত" },
    { Icon: Truck, title: "দ্রুত ডেলিভারি", sub: "সারা বাংলাদেশে" },
];

function FloatingCard({ Icon, title, sub }: { Icon: React.ElementType; title: string; sub: string }) {
    return (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/25 rounded-2xl shadow-md px-4 py-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(181,69,27,0.6)" }}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
                <p className="font-bengali font-bold text-sm text-white leading-tight whitespace-nowrap">{title}</p>
                <p className="font-bengali text-[11px] text-white/80 leading-tight whitespace-nowrap">{sub}</p>
            </div>
        </div>
    );
}

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden aspect-[16/9] md:aspect-auto md:h-[650px] lg:h-[720px]">

            {/* ── Background: hero-lg.webp for all screen sizes ── */}
            <div className="absolute inset-0">
                <Image
                    src="/assets/hero/hero-lg.webp"
                    alt="Sultan Bazar — সুলতান বাজার"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Left-to-right gradient so left-side text is readable; products are on right */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, rgba(10,5,0,0.70) 0%, rgba(10,5,0,0.42) 42%, rgba(10,5,0,0.08) 65%, transparent 85%)",
                    }}
                />
            </div>

            {/* ── Text content ── */}
            {/* Mobile: starts at top-left (justify-start + pt-8) */}
            {/* Desktop: vertically centered on the left side (md:justify-center) */}
            <div className="relative z-10 h-full flex flex-col justify-center md:justify-center px-5 pl-4 md:pl-16 lg:pl-24 md:pt-0 max-w-[85%] md:max-w-[50%] lg:max-w-[44%]">

                {/* Main headline */}
                <h1
                    className="hero-anim-2 font-bengali text-[22px] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-1.5 md:mb-4"
                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.35)" }}
                >
                    ঘরের সব বাজার,<br />
                    <span style={{ color: "#F5D078" }}>এখন এক ঠিকানায়</span>
                </h1>

                {/* Subtext — hidden on small mobile to save space */}
                <p className="hero-anim-3 font-bengali text-[11px] md:text-sm text-white/80 leading-relaxed mb-3 md:mb-8 max-w-[280px] md:max-w-none">
                    রান্নার উপকরণ থেকে প্রতিদিনের খাবার —<br />
                    পরিবারের সব পণ্য এখন এক জায়গায়।
                </p>

                {/* CTA button */}
                <div className="hero-anim-4">
                    <Link
                        href="/shop"
                        className="inline-flex hover:bg-[#f34b0f7a] border border-white/30 items-center gap-2 font-bengali font-bold text-white text-sm md:text-base px-6 py-3 md:px-8 md:py-3.5 rounded-full transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        style={{
                            background: "#b5441b9f",
                            boxShadow: "0 6px 24px rgba(181,69,27,0.45)",
                        }}
                    >
                        কেনাকাটা করুন
                    </Link>
                </div>
            </div>

            {/* ── Floating cards (right half, desktop) ── */}
            {/* Natural — top, centre-right */}
            <div className="hidden md:block absolute top-[16%] left-[46%] z-10">
                <FloatingCard Icon={Leaf} title="১০০% খাঁটি পণ্য" sub="কোনো ভেজাল নেই" />
            </div>
            {/* Delivery — lower, left of the products */}
            <div className="hidden lg:block absolute bottom-[22%] left-[36%] z-10">
                <FloatingCard Icon={Truck} title="দ্রুত ডেলিভারি" sub="১–২ দিনে ঘরে" />
            </div>
            {/* Trusted — bottom right, above the trust bar */}
            <div className="hidden md:block absolute bottom-[16%] right-[3%] z-10">
                <div className="bg-white/10 backdrop-blur-sm border border-white/25 rounded-2xl shadow-md px-4 py-3">
                    <TrustedAvatars />
                </div>
            </div>

            {/* ── Bottom trust bar (desktop) ── */}
            <div className="hidden md:flex absolute bottom-0 inset-x-0 z-10 items-center justify-center divide-x divide-orange-100 bg-white/75 backdrop-blur-md border-t border-white/40">
                {bottomItems.map(({ Icon, title, sub }) => (
                    <div key={title} className="flex items-center gap-2.5 px-6 lg:px-10 py-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: BRAND_TINT }}>
                            <Icon className="w-4 h-4" style={{ color: BRAND }} />
                        </div>
                        <div>
                            <p className="font-bengali font-semibold text-sm text-gray-800 leading-tight whitespace-nowrap">{title}</p>
                            <p className="font-bengali text-[10px] text-gray-500 leading-tight whitespace-nowrap">{sub}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
