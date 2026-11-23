"use client";
/* hallmark:v1 — warm-authentic, Bangladeshi grocery, trust + navigation */
import Link from "next/link";
import Image from "next/image";
import { Facebook, MessageSquare, MapPin, Phone, Mail, Clock } from "lucide-react";

const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const customerLinks = [
    { label: "My Orders", href: "/dashboard/user" },
    { label: "Return Policy", href: "/return-policy" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy-policy" },
];

const contactItems = [
    {
        icon: MapPin,
        content: "House 26, Road 03, PC Culture Housing Society, Mohammadpur, Dhaka 1216",
    },
    {
        icon: Phone,
        href: "tel:+8801711229443",
        content: "+880 1711-229443",
    },
    {
        icon: Mail,
        href: "mailto:asr.globaltrade.bd@gmail.com",
        content: "asr.globaltrade.bd@gmail.com",
    },
    {
        icon: Clock,
        content: "Sat – Thu: 9 am – 9 pm",
    },
];

const socials = [
    {
        icon: Facebook,
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61581883173632",
        hoverBg: "#1877F2",
    },
    {
        icon: MessageSquare,
        label: "WhatsApp",
        href: "https://wa.me/8801711229443",
        hoverBg: "#25D366",
    },
];

export default function Footer() {
    return (
        <footer className="relative text-gray-300" style={{ overflow: "clip" }}>
            {/* Background */}
            <Image
                src="/images/footer-image.jpg"
                alt=""
                aria-hidden="true"
                fill
                className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: "rgba(10, 5, 2, 0.78)" }} />

            {/* Main grid */}
            <div className="relative z-10 container mx-auto px-4 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Col 1 — Brand */}
                    <div>
                        <Link href="/" className="inline-block mb-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white rounded-sm">
                            <div className="relative w-44 h-14">
                                <Image
                                    src="/assets/logo-white-bg-removed.png"
                                    alt="Sultan Bazar"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="font-bengali text-sm text-gray-400 mb-1" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                            স্বাদে খাঁটি, মানে নিখুঁত
                        </p>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                            Your trusted source for 100% natural spices, oils, and cooking essentials — bringing the best of Bangladesh to your kitchen.
                        </p>
                        <div className="flex gap-3">
                            {socials.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={s.label}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/8 border border-white/10 text-gray-400 transition-[background-color,color,opacity,transform] duration-200 hover:text-white hover:border-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                    style={{ backdropFilter: "blur(8px)" }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = s.hoverBg; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                                >
                                    <s.icon className="w-4 h-4" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 — Quick Links */}
                    <div>
                        <p className="text-white font-semibold mb-4 text-sm" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                            Quick Links
                        </p>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 transition-[color,opacity] duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Customer Service */}
                    <div>
                        <p className="text-white font-semibold mb-4 text-sm" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                            Customer Service
                        </p>
                        <ul className="space-y-2.5">
                            {customerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-gray-400 transition-[color,opacity] duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4 — Contact */}
                    <div>
                        <p className="text-white font-semibold mb-4 text-sm" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                            Contact Us
                        </p>
                        <ul className="space-y-3">
                            {contactItems.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                    <span className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backdropFilter: "blur(4px)" }}>
                                        <item.icon className="w-3.5 h-3.5" style={{ color: "#D4860A" }} aria-hidden="true" />
                                    </span>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            className="transition-[color,opacity] duration-150 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                                            style={{ overflowWrap: "break-word", minWidth: 0 }}
                                        >
                                            {item.content}
                                        </a>
                                    ) : (
                                        <span style={{ overflowWrap: "break-word", minWidth: 0 }}>{item.content}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="relative z-10 border-t border-white/10" style={{ background: "rgba(0,0,0,0.25)" }}>
                <div className="container mx-auto px-4 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        © 2026 Sultan Bazar. All rights reserved.
                    </p>
                    <span className="text-xs font-medium px-3 py-1 rounded-full text-gray-400 border border-white/8 bg-white/5">
                        Cash on Delivery
                    </span>
                </div>
            </div>
        </footer>
    );
}
