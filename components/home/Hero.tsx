"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden aspect-[16/9] md:aspect-auto md:h-[600px] lg:h-[680px]">

            {/* ── Mobile background (< md): hero-sm.webp ── */}
            <div className="md:hidden absolute inset-0">
                <Image
                    src="/assets/hero/hero-sm.webp"
                    alt="Sultan Bazar — সুলতান বাজার"
                    fill
                    className="object-cover object-center"
                    priority
                />
                {/* Top-to-bottom gradient so top-left text is readable */}
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(10,5,0,0.65) 0%, rgba(10,5,0,0.40) 50%, transparent 78%)",
                    }}
                />
            </div>

            {/* ── Desktop background (md+): hero-lg.webp ── */}
            <div className="hidden md:block absolute inset-0">
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
                    রান্নার উপকরণ থেকে প্রতিদিনের খাবার —<br className="hidden md:block" />
                    পরিবারের সব পণ্য এখন এক জায়গায়।
                </p>

                {/* CTA button */}
                <div className="hero-anim-4">
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 font-bengali font-bold text-white text-sm md:text-base px-6 py-3 md:px-8 md:py-3.5 rounded-full transition-transform hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        style={{
                            background: "#B5451B",
                            boxShadow: "0 6px 24px rgba(181,69,27,0.45)",
                        }}
                    >
                        এখনই কেনাকাটা করুন ›
                    </Link>
                </div>
            </div>
        </section>
    );
}
