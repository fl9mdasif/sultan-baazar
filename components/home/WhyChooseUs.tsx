"use client";

import { motion, type Variants } from "framer-motion";
import { Award, Leaf, Shield, Factory, Truck, Tag } from "lucide-react";

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const features = [
    {
        Icon: Award,
        title: "BSTI সার্টিফাইড",
        sub: "BSTI Certified",
        desc: "All our products meet Bangladesh Standards and Testing Institution quality standards.",
    },
    {
        Icon: Leaf,
        title: "১০০% প্রাকৃতিক",
        sub: "100% Natural",
        desc: "Pure, natural ingredients with no artificial additives, colors, or flavor enhancers.",
    },
    {
        Icon: Shield,
        title: "প্রিজার্ভেটিভ মুক্ত",
        sub: "No Preservatives",
        desc: "Free from artificial preservatives — just wholesome, fresh goodness in every pack.",
    },
    {
        Icon: Factory,
        title: "নিজস্ব প্রক্রিয়াজাত",
        sub: "Own Processing Unit",
        desc: "Processed in our own facility under strict hygiene and quality control standards.",
    },
    {
        Icon: Truck,
        title: "দ্রুত ডেলিভারি",
        sub: "Fast Delivery",
        desc: "We deliver across Bangladesh within 1 business days, right to your doorstep.",
    },
    {
        Icon: Tag,
        title: "সেরা মূল্য",
        sub: "Best Prices",
        desc: "Direct from source means we cut out the middleman and pass the savings to you.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-8 lg:py-12" style={{ background: "var(--brand-cream)" }}>
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <h2 className="font-bengali text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
                        কেন <span style={{ color: "var(--brand-primary)" }}>সুলতান বাজার</span> বেছে নেবেন?
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Quality, trust and care — in every order
                    </p>
                </motion.div>

                {/* Feature cards directly on cream background — no outer wrapper card */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4"
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {features.map((f) => (
                        <motion.div
                            key={f.title}
                            variants={item}
                            className="hover-lift rounded-2xl p-4 lg:p-5 flex flex-col gap-2 bg-white"
                            style={{ border: "1px solid #F0E6D3" }}
                        >
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: "color-mix(in srgb, var(--brand-primary) 10%, transparent)", color: "var(--brand-primary)" }}
                                aria-hidden="true"
                            >
                                <f.Icon width={18} height={18} />
                            </div>
                            <div>
                                <h3 className="font-bengali text-sm lg:text-base font-bold text-gray-900 leading-tight">
                                    {f.title}
                                </h3>
                                <p className="text-[10px] lg:text-xs font-semibold mt-0.5" style={{ color: "var(--brand-primary)" }}>
                                    {f.sub}
                                </p>
                            </div>
                            <p className="text-gray-500 text-[11px] lg:text-xs leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
