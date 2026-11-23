"use client";

/* eslint-disable react/no-unescaped-entities */

import Image from "next/image";
import Link from "next/link";
import { Leaf, Award, Heart, Users, Truck, Shield, Factory, MapPin, Package, Star, CheckCircle, Tag } from "lucide-react";

// ─── data ───────────────────────────────────────────────────────────────────

const STATS = [
    { Icon: Factory, value: "1994", label: "Founded in Dhaka" },
    { Icon: MapPin, value: "50+", label: "Cities delivered" },
    { Icon: Package, value: "24", label: "Product lines" },
    { Icon: Star, value: "4.8", label: "Customer rating" },
] as const;

const VALUES = [
    {
        Icon: Leaf,
        title: "Natural Ingredients",
        desc: "Every product uses 100% natural ingredients — no artificial preservatives, colours or flavour enhancers.",
    },
    {
        Icon: Award,
        title: "BSTI Certified",
        desc: "Our full range meets Bangladesh Standards and Testing Institution requirements before anything ships.",
    },
    {
        Icon: Heart,
        title: "Generational Recipes",
        desc: "Flavours refined over decades of Bangladeshi culinary tradition, brought to your kitchen exactly as they were.",
    },
    {
        Icon: Users,
        title: "Local Farmers",
        desc: "Sourced directly from trusted growers across Bangladesh — no middlemen, more for the people who grow it.",
    },
    {
        Icon: Truck,
        title: "2–4 Day Delivery",
        desc: "Fresh to your doorstep within two to four business days, across more than fifty cities nationwide.",
    },
    {
        Icon: Shield,
        title: "Own Processing Unit",
        desc: "Handled in-house under strict hygiene and quality control — the same care applied to every batch.",
    },
] as const;

const BADGES = ["BSTI Certified", "100% Natural", "No Preservatives", "Locally Sourced"] as const;

// ─── component ──────────────────────────────────────────────────────────────

export default function AboutPage() {
    return (
        <>
            <style>{`
                /* Hallmark v1 — Sultan Bazar / About — warm-editorial */
                /* Rebuilt: emojis→icons, eyebrows removed, broken image refs fixed, tokens extracted */

                :root {
                    --clr-brand:   #B5451B;
                    --clr-gold:    #D4860A;
                    --clr-cream:   #FDF6EC;
                    --clr-cream2:  #FEF3CD;
                    --clr-border:  #F0E6D3;
                    --clr-ink:     #111827;
                    --clr-muted:   #6B7280;
                    --clr-white:   #FFFFFF;
                    --clr-bg:      #FAFAF8;
                    --ff-body:     "Inter", system-ui, sans-serif;
                    --ff-bengali:  "Hind Siliguri", var(--ff-body);
                    --r-card:      1.25rem;
                    --r-lg:        1.75rem;
                    --gap-grid:    1.5rem;
                }

                .about-root {
                    overflow-x: clip;
                    background: var(--clr-bg);
                    min-height: 100svh;
                }

                .about-container {
                    width: 100%;
                    max-width: 1200px;
                    margin-inline: auto;
                    padding-inline: clamp(1rem, 4vw, 2.5rem);
                }

                /* ── hero ─────────────────────────────────── */
                .about-hero {
                    position: relative;
                    min-height: clamp(320px, 45svh, 540px);
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                }

                .about-hero-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(
                        to bottom,
                        rgba(17,24,39,0.55) 0%,
                        rgba(17,24,39,0.42) 60%,
                        rgba(17,24,39,0.65) 100%
                    );
                }

                .about-hero-content {
                    position: relative;
                    z-index: 1;
                    padding-block: clamp(3rem, 8vh, 5.5rem);
                    color: var(--clr-white);
                    max-width: 640px;
                }

                .about-hero-content h1 {
                    font-size: clamp(2rem, 4.5vw, 3.25rem);
                    font-weight: 900;
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    overflow-wrap: break-word;
                    min-width: 0;
                    margin-bottom: 1rem;
                    color: var(--clr-white);
                }

                .about-hero-content h1 em {
                    font-style: normal;
                    color: var(--clr-cream2);
                }

                .about-hero-content p {
                    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
                    line-height: 1.65;
                    color: rgba(255,255,255,0.88);
                    max-width: 48ch;
                    margin-bottom: 2rem;
                }

                .about-hero-cta {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--clr-brand);
                    color: var(--clr-white);
                    font-weight: 700;
                    font-size: 0.9rem;
                    padding: 0.8rem 1.75rem;
                    border-radius: 100vmax;
                    text-decoration: none;
                    transition: opacity 0.2s, transform 0.2s;
                }

                .about-hero-cta:hover { opacity: 0.9; transform: translateY(-1px); }
                .about-hero-cta:focus-visible {
                    outline: 3px solid var(--clr-cream2);
                    outline-offset: 3px;
                }

                /* ── story ───────────────────────────────── */
                .about-story {
                    padding-block: clamp(3rem, 7vw, 5rem);
                }

                .about-story-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: clamp(2rem, 5vw, 4rem);
                    align-items: center;
                }

                @media (min-width: 900px) {
                    .about-story-grid { grid-template-columns: 1fr 1fr; }
                }

                .about-story h2 {
                    font-size: clamp(1.6rem, 3vw, 2.5rem);
                    font-weight: 900;
                    color: var(--clr-ink);
                    line-height: 1.15;
                    letter-spacing: -0.02em;
                    overflow-wrap: break-word;
                    min-width: 0;
                    margin-bottom: 1.25rem;
                }

                .about-story h2 em {
                    font-style: normal;
                    color: var(--clr-brand);
                }

                .about-story p {
                    color: var(--clr-muted);
                    line-height: 1.75;
                    margin-bottom: 1rem;
                    font-size: 0.975rem;
                }

                .about-badges {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 1.5rem;
                }

                .about-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0.35rem 0.85rem;
                    border-radius: 100vmax;
                    background: color-mix(in srgb, var(--clr-brand) 10%, transparent);
                    color: var(--clr-brand);
                }

                .about-story-img-wrap {
                    position: relative;
                    border-radius: var(--r-lg);
                    overflow: hidden;
                    aspect-ratio: 4 / 3;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.12);
                }

                .about-story-img-badge {
                    position: absolute;
                    bottom: -1rem;
                    left: -1rem;
                    background: var(--clr-white);
                    border-radius: 1rem;
                    border: 1.5px solid var(--clr-border);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                    padding: 0.75rem 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 1;
                }

                /* ── stats ───────────────────────────────── */
                .about-stats {
                    padding-block: clamp(2rem, 5vw, 3.5rem);
                    border-top: 1px solid var(--clr-border);
                    border-bottom: 1px solid var(--clr-border);
                }

                .about-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: var(--gap-grid);
                }

                @media (min-width: 640px) {
                    .about-stats-grid { grid-template-columns: repeat(4, 1fr); }
                }

                .about-stat {
                    background: var(--clr-white);
                    border: 1.5px solid var(--clr-border);
                    border-radius: var(--r-card);
                    padding: 1.5rem;
                    text-align: center;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .about-stat:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
                }

                .about-stat-icon {
                    width: 2.5rem;
                    height: 2.5rem;
                    border-radius: 0.75rem;
                    background: color-mix(in srgb, var(--clr-brand) 10%, transparent);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-inline: auto;
                    margin-bottom: 0.75rem;
                    color: var(--clr-brand);
                }

                .about-stat-value {
                    font-size: 1.75rem;
                    font-weight: 900;
                    color: var(--clr-brand);
                    line-height: 1;
                    margin-bottom: 0.35rem;
                }

                .about-stat-label {
                    font-size: 0.75rem;
                    color: var(--clr-muted);
                    font-weight: 500;
                }

                /* ── values ──────────────────────────────── */
                .about-values {
                    padding-block: clamp(3rem, 7vw, 5rem);
                }

                .about-values h2 {
                    font-size: clamp(1.6rem, 3vw, 2.5rem);
                    font-weight: 900;
                    color: var(--clr-ink);
                    letter-spacing: -0.02em;
                    overflow-wrap: break-word;
                    min-width: 0;
                    margin-bottom: 2.5rem;
                }

                .about-values h2 em {
                    font-style: normal;
                    color: var(--clr-brand);
                }

                .about-values-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--gap-grid);
                }

                @media (min-width: 560px) {
                    .about-values-grid { grid-template-columns: repeat(2, 1fr); }
                }

                @media (min-width: 900px) {
                    .about-values-grid { grid-template-columns: repeat(3, 1fr); }
                }

                .about-value {
                    background: var(--clr-white);
                    border: 1.5px solid var(--clr-border);
                    border-radius: var(--r-card);
                    padding: 1.5rem;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .about-value:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.07);
                }

                .about-value-icon {
                    width: 2.75rem;
                    height: 2.75rem;
                    border-radius: 0.75rem;
                    background: var(--clr-brand);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--clr-white);
                    margin-bottom: 1rem;
                }

                .about-value h3 {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: var(--clr-ink);
                    margin-bottom: 0.5rem;
                }

                .about-value p {
                    font-size: 0.85rem;
                    color: var(--clr-muted);
                    line-height: 1.65;
                }

                /* ── cta ─────────────────────────────────── */
                .about-cta {
                    position: relative;
                    border-radius: var(--r-lg);
                    overflow: hidden;
                    min-height: 280px;
                    display: flex;
                    align-items: center;
                    margin-bottom: clamp(2rem, 5vw, 4rem);
                }

                .about-cta-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(181, 69, 27, 0.90);
                }

                .about-cta-content {
                    position: relative;
                    z-index: 1;
                    padding: clamp(2.5rem, 6vw, 4rem);
                    color: var(--clr-white);
                    max-width: 560px;
                }

                .about-cta-content h2 {
                    font-size: clamp(1.6rem, 3vw, 2.5rem);
                    font-weight: 900;
                    color: var(--clr-white);
                    line-height: 1.1;
                    letter-spacing: -0.02em;
                    overflow-wrap: break-word;
                    min-width: 0;
                    margin-bottom: 0.75rem;
                }

                .about-cta-content p {
                    color: rgba(255,255,255,0.85);
                    font-size: 0.95rem;
                    line-height: 1.65;
                    margin-bottom: 1.75rem;
                    max-width: 44ch;
                }

                .about-cta-btn {
                    display: inline-flex;
                    align-items: center;
                    background: var(--clr-white);
                    color: var(--clr-brand);
                    font-weight: 700;
                    font-size: 0.875rem;
                    padding: 0.75rem 1.75rem;
                    border-radius: 100vmax;
                    text-decoration: none;
                    transition: opacity 0.2s, transform 0.2s;
                }

                .about-cta-btn:hover { opacity: 0.92; transform: translateY(-1px); }
                .about-cta-btn:focus-visible {
                    outline: 3px solid var(--clr-cream2);
                    outline-offset: 3px;
                }

                /* ── showroom ─────────────────────────────── */
                .about-showroom {
                    padding-block: clamp(3rem, 7vw, 5rem);
                    border-top: 1px solid var(--clr-border);
                }

                .about-showroom h2 {
                    font-size: clamp(1.6rem, 3vw, 2.5rem);
                    font-weight: 900;
                    color: var(--clr-ink);
                    letter-spacing: -0.02em;
                    overflow-wrap: break-word;
                    min-width: 0;
                    margin-bottom: 1rem;
                }

                .about-showroom h2 em {
                    font-style: normal;
                    color: var(--clr-brand);
                }

                .about-showroom-desc {
                    color: var(--clr-muted);
                    font-size: 0.975rem;
                    line-height: 1.75;
                    max-width: 60ch;
                    margin-bottom: 2rem;
                }

                .about-showroom-photos {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--gap-grid);
                    margin-bottom: 2rem;
                }

                @media (min-width: 640px) {
                    .about-showroom-photos { grid-template-columns: 1fr 1fr; }
                }

                .about-showroom-photo {
                    position: relative;
                    border-radius: var(--r-card);
                    overflow: hidden;
                    aspect-ratio: 4 / 3;
                    background: var(--clr-cream);
                    border: 1.5px solid var(--clr-border);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .about-showroom-photo-label {
                    position: absolute;
                    bottom: 0.75rem;
                    left: 0.75rem;
                    background: rgba(0,0,0,0.55);
                    color: #fff;
                    font-size: 0.75rem;
                    font-weight: 600;
                    padding: 0.25rem 0.65rem;
                    border-radius: 100vmax;
                    backdrop-filter: blur(4px);
                }

                .about-showroom-photo-placeholder {
                    color: var(--clr-muted);
                    font-size: 0.8rem;
                    text-align: center;
                    padding: 1rem;
                    opacity: 0.6;
                }

                .about-showroom-coupon {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    background: color-mix(in srgb, var(--clr-brand) 8%, transparent);
                    border: 1.5px solid color-mix(in srgb, var(--clr-brand) 20%, transparent);
                    border-radius: var(--r-card);
                    padding: 1.25rem 1.5rem;
                }

                .about-showroom-coupon-code {
                    font-family: "Courier New", monospace;
                    font-size: 1.05rem;
                    font-weight: 900;
                    color: var(--clr-brand);
                    letter-spacing: 0.08em;
                    background: var(--clr-white);
                    border: 1.5px dashed color-mix(in srgb, var(--clr-brand) 35%, transparent);
                    border-radius: 0.5rem;
                    padding: 0.15rem 0.65rem;
                    display: inline-block;
                }

                /* ── reduced motion ──────────────────────── */
                @media (prefers-reduced-motion: reduce) {
                    .about-hero-cta,
                    .about-stat,
                    .about-value,
                    .about-cta-btn { transition: none; }
                    .about-stat:hover,
                    .about-value:hover { transform: none; }
                }
            `}</style>

            <div className="about-root">

                {/* ── Hero ───────────────────────────────────────────────────── */}
                <section className="about-hero">
                    <Image
                        src="/images/spoon-masala.jpg"
                        alt="Sultan Bazar spices"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                    <div className="about-hero-overlay" aria-hidden="true" />
                    <div className="about-container">
                        <div className="about-hero-content">
                            <h1>
                                Pure food from <em>Bangladesh's farms.</em>
                            </h1>
                            <p>
                                Natural, preservative-free products sourced directly from
                                trusted local growers — delivered to Bangladeshi families since 1994.
                            </p>
                            <Link href="/shop" className="about-hero-cta">
                                Shop Products
                            </Link>
                        </div>
                    </div>
                </section>

                <div className="about-container">

                    {/* ── Story ──────────────────────────────────────────────── */}
                    <section className="about-story">
                        <div className="about-story-grid">
                            <div>
                                <h2>
                                    Rooted in tradition,{" "}
                                    <em>built for today.</em>
                                </h2>
                                <p>
                                    Sultan Bazar was founded in 1994 in Dhaka with one goal —
                                    to give Bangladeshi families the purest, most authentic food
                                    products at fair prices. What began as a small mustard-oil
                                    producer has grown into one of the country's most trusted names.
                                </p>
                                <p>
                                    Our range now spans premium mustard oils, hand-crafted masala
                                    mixes, aromatic rice, whole spices and more — every product made
                                    with the same care that defined our very first batch.
                                </p>
                                <div className="about-badges">
                                    {BADGES.map((t) => (
                                        <span key={t} className="about-badge">
                                            <CheckCircle width={12} height={12} />
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ position: "relative" }}>
                                <div className="about-story-img-wrap">
                                    <Image
                                        src="/images/jar_opening.png"
                                        alt="Sultan Bazar products"
                                        fill
                                        className="object-cover object-center"
                                    />
                                </div>
                                <div className="about-story-img-badge">
                                    <Star
                                        width={22}
                                        height={22}
                                        fill="var(--clr-gold)"
                                        stroke="var(--clr-gold)"
                                    />
                                    <div>
                                        <p style={{ fontWeight: 800, fontSize: "1.1rem", lineHeight: 1, color: "var(--clr-ink)" }}>
                                            4.8 / 5
                                        </p>
                                        <p style={{ fontSize: "0.7rem", color: "var(--clr-muted)", marginTop: "0.2rem" }}>
                                            Customer rating
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── Stats ──────────────────────────────────────────────── */}
                    <section className="about-stats">
                        <div className="about-stats-grid">
                            {STATS.map(({ Icon, value, label }) => (
                                <div key={label} className="about-stat">
                                    <div className="about-stat-icon" aria-hidden="true">
                                        <Icon width={18} height={18} />
                                    </div>
                                    <p className="about-stat-value">{value}</p>
                                    <p className="about-stat-label">{label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Values ─────────────────────────────────────────────── */}
                    <section className="about-values">
                        <h2>
                            What we <em>stand for.</em>
                        </h2>
                        <div className="about-values-grid">
                            {VALUES.map(({ Icon, title, desc }) => (
                                <div key={title} className="about-value">
                                    <div className="about-value-icon" aria-hidden="true">
                                        <Icon width={20} height={20} />
                                    </div>
                                    <h3>{title}</h3>
                                    <p>{desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Showroom ───────────────────────────────────────────── */}
                    <section className="about-showroom">
                        <h2>আমাদের শোরুমে <em>আপনাকে স্বাগতম।</em></h2>
                        <p className="about-showroom-desc">
                            অনলাইনের পাশাপাশি আমাদের রয়েছে নিজস্ব শোরুম, যেখানে সরাসরি এসে আমাদের কার্যক্রম সম্পর্কে জানতে এবং সেবা নিতে পারবেন। আমরা বিশ্বাস করি, সরাসরি যোগাযোগ ও স্বচ্ছতাই গ্রাহকের আস্থার ভিত্তি।
                        </p>

                        <div className="about-showroom-photos">
                            <div className="about-showroom-photo">
                                <Image
                                    src="/images/showroom-front.jpg"
                                    alt="Sultan Bazar showroom — সামনের দৃশ্য"
                                    fill
                                    className="object-cover object-center"
                                />
                                <span className="about-showroom-photo-label">সামনের দৃশ্য</span>
                            </div>
                            <div className="about-showroom-photo">
                                <Image
                                    src="/images/showroom-indoor.jpg"
                                    alt="Sultan Bazar showroom — ভেতরের দৃশ্য"
                                    fill
                                    className="object-cover object-center"
                                />
                                <span className="about-showroom-photo-label">ভেতরের দৃশ্য</span>
                            </div>
                        </div>

                        <div className="about-showroom-coupon">
                            <Tag width={20} height={20} style={{ color: "var(--clr-brand)", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
                            <div>
                                <p style={{ fontWeight: 700, color: "var(--clr-ink)", fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                                    শোরুম পরিদর্শনকারীদের জন্য বিশেষ ছাড়
                                </p>
                                <p style={{ color: "var(--clr-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                                    আমাদের শোরুমে এসে পরিদর্শন করুন এবং অনলাইনে অর্ডার করার সময় কোড{" "}
                                    <span className="about-showroom-coupon-code">SHOWROOM5</span>{" "}
                                    ব্যবহার করে{" "}
                                    <strong style={{ color: "var(--clr-brand)" }}>flat 5% ছাড়</strong> পান।
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ── CTA ────────────────────────────────────────────────── */}
                    <section className="about-cta">
                        <Image
                            src="/images/footer-image.jpg"
                            alt="Sultan Bazar products"
                            fill
                            className="object-cover object-center"
                        />
                        <div className="about-cta-overlay" aria-hidden="true" />
                        <div className="about-cta-content">
                            <h2>Taste the difference.</h2>
                            <p>
                                Explore our full range of authentic Bangladeshi food products —
                                crafted with care, delivered fresh.
                            </p>
                            <Link href="/shop" className="about-cta-btn">
                                Browse Products
                            </Link>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
}
