"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, Menu, LogOut, LayoutDashboard, ChevronDown, Package, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { getUserInfo, removeUser, isLoggedIn } from "@/services/auth.services";
import { useGetCartQuery } from "@/redux/api/cartApi";
import { useGetAllCategoriesQuery } from "@/redux/api/categoryApi";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import type { TCategory } from "@/types/common";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

function StatusBar() {
    const [time, setTime] = useState("9:41")

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, "0");
            const m = now.getMinutes().toString().padStart(2, "0");
            setTime(`${h}:${m}`);
        };
        update();
        const t = setInterval(update, 30000);
        return () => clearInterval(t);
    }, []);

    return (
        <div
            className="md:hidden flex items-center justify-between px-5 pt-2 pb-1"
            style={{ background: "#FDF6EC" }}
        >
            <span className="text-[12px] font-bold text-gray-800">{time}</span>
            <div className="flex items-center gap-1.5 text-gray-700">
                {/* Signal */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
                    <rect x="0" y="7" width="2.5" height="4" rx="0.5" />
                    <rect x="3.5" y="5" width="2.5" height="6" rx="0.5" />
                    <rect x="7" y="3" width="2.5" height="8" rx="0.5" />
                    <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" />
                </svg>
                {/* Wifi */}
                <svg width="15" height="11" viewBox="0 0 20 15" fill="currentColor">
                    <path d="M10 11a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4-3.5a5.5 5.5 0 018 0l-1.2 1.2a3.75 3.75 0 00-5.6 0L6 7.5zm-3-3A9.5 9.5 0 0117 4.5L15.8 5.7A7.75 7.75 0 004.2 5.7L3 4.5zm-2.5-2.5A13.5 13.5 0 0119.5 2L18.3 3.2A11.75 11.75 0 001.7 3.2L.5 2z" />
                </svg>
                {/* Battery */}
                <svg width="22" height="11" viewBox="0 0 26 13" fill="currentColor">
                    <rect x="0.75" y="0.75" width="21.5" height="11.5" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    <rect x="2.25" y="2.25" width="16" height="8.5" rx="1.5" />
                    <path d="M23 4.5v4a2.5 2.5 0 000-4z" />
                </svg>
            </div>
        </div>
    );
}

export default function Navbar() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [catDropdownOpen, setCatDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const catDropdownRef = useRef<HTMLDivElement>(null);
    const { data: categoryData } = useGetAllCategoriesQuery({});
    const categories: TCategory[] = categoryData || [];

    const user = getUserInfo();
    const userIsLoggedIn = isLoggedIn() && Boolean(user);
    const loggedIn = userIsLoggedIn;
    const userName = user?.name || user?.email || "U";
    const userInitial = userName.charAt(0).toUpperCase();
    const userPhoto = user?.profilePicture || null;
    const { data: cartData } = useGetCartQuery({}, { skip: !userIsLoggedIn });

    const wishlistItems = useAppSelector((state) => state.wishlist.items);
    const wishlistCount = wishlistItems.length;

    const localCartItems = useAppSelector((state) => state.localCart.items);
    const cartLength = userIsLoggedIn
        ? (cartData?.items?.length || 0)
        : localCartItems.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
            if (catDropdownRef.current && !catDropdownRef.current.contains(e.target as Node)) {
                setCatDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        removeUser();
        setDropdownOpen(false);
        router.push("/");
        router.refresh();
    };

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                scrolled ? "shadow-lg" : ""
            }`}
            style={{ background: "#FDF6EC" }}
        >
            {/* Decorative status bar — mobile only */}
            <StatusBar />

            {/* Main nav row */}
            <div
                className="bg-white px-4 py-2.5"
                style={{
                    boxShadow: scrolled
                        ? "0 2px 20px rgba(0,0,0,0.10)"
                        : "0 1px 0 rgba(0,0,0,0.06)",
                }}
            >
                <div className="flex items-center justify-between gap-3">

                    {/* ── LEFT: Hamburger (mobile) + Logo (desktop) ── */}
                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button
                                    className="w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-orange-50"
                                    style={{ background: "#FDF6EC" }}
                                    aria-label="Open menu"
                                >
                                    <Menu className="w-5 h-5 text-gray-700" />
                                </button>
                            </SheetTrigger>

                            <SheetContent side="left" className="w-72 p-0 bg-white">
                                <div className="flex flex-col h-full">
                                    <div
                                        className="px-6 py-5 border-b"
                                        style={{ background: "#FDF6EC", borderColor: "#F0E6D3" }}
                                    >
                                        <p
                                            className="font-bengali text-xl font-bold leading-tight"
                                            style={{ color: "#B5451B" }}
                                        >
                                            সুলতান বাজার
                                        </p>
                                        <p className="font-bengali text-xs text-gray-500 mt-0.5">
                                            সেরা পণ্য, সেরা দাম
                                        </p>
                                    </div>

                                    {loggedIn && (
                                        <div className="flex items-center gap-3 px-6 py-4 border-b bg-orange-50/40">
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative overflow-hidden"
                                                style={
                                                    userPhoto
                                                        ? {}
                                                        : { background: "linear-gradient(135deg, #B5451B, #D4860A)" }
                                                }
                                            >
                                                {userPhoto ? (
                                                    <Image src={userPhoto} alt={userName} fill className="object-cover" />
                                                ) : (
                                                    userInitial
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {userName}
                                                </p>
                                                <p className="text-xs text-gray-500">Logged in</p>
                                            </div>
                                        </div>
                                    )}

                                    <nav className="flex-1 px-2 py-4 space-y-0.5">
                                        {navLinks.map((link) => (
                                            <SheetClose asChild key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-[#B5451B] hover:bg-orange-50 rounded-xl transition-colors font-medium"
                                                >
                                                    {link.label}
                                                </Link>
                                            </SheetClose>
                                        ))}

                                        <div className="pt-1 border-t" style={{ borderColor: "#F0E6D3" }}>
                                            <SheetClose asChild>
                                                <Link
                                                    href="/cart"
                                                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-[#B5451B] hover:bg-orange-50 rounded-xl transition-colors font-medium"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <ShoppingCart className="w-4 h-4" />
                                                        Cart
                                                    </div>
                                                    {cartLength > 0 && (
                                                        <span
                                                            className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                                                            style={{ background: "#B5451B" }}
                                                        >
                                                            {cartLength > 9 ? "9+" : cartLength}
                                                        </span>
                                                    )}
                                                </Link>
                                            </SheetClose>
                                            <SheetClose asChild>
                                                <Link
                                                    href="/wishlist"
                                                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-[#B5451B] hover:bg-orange-50 rounded-xl transition-colors font-medium"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Heart className="w-4 h-4" />
                                                        Wishlist
                                                    </div>
                                                    {wishlistCount > 0 && (
                                                        <span
                                                            className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                                                            style={{ background: "#D4860A" }}
                                                        >
                                                            {wishlistCount > 9 ? "9+" : wishlistCount}
                                                        </span>
                                                    )}
                                                </Link>
                                            </SheetClose>
                                        </div>
                                    </nav>

                                    <div className="px-4 pb-6 space-y-2 border-t pt-4" style={{ borderColor: "#F0E6D3" }}>
                                        {loggedIn ? (
                                            <>
                                                <SheetClose asChild>
                                                    <Link href="/dashboard">
                                                        <Button
                                                            className="w-full text-white rounded-xl"
                                                            style={{ background: "#B5451B" }}
                                                        >
                                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                                            Dashboard
                                                        </Button>
                                                    </Link>
                                                </SheetClose>
                                                <Button
                                                    variant="outline"
                                                    className="w-full border-red-200 text-red-600 rounded-xl"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="w-4 h-4 mr-2" />
                                                    Logout
                                                </Button>
                                            </>
                                        ) : (
                                            <SheetClose asChild>
                                                <Link href="/login">
                                                    <Button
                                                        className="w-full text-white rounded-xl"
                                                        style={{ background: "#B5451B" }}
                                                    >
                                                        <User className="w-4 h-4 mr-2" />
                                                        Login / Sign Up
                                                    </Button>
                                                </Link>
                                            </SheetClose>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Desktop logo */}
                        <Link href="/" className="hidden lg:flex items-center">
                            <div className="relative w-44 h-12">
                                <Image
                                    src="/assets/logo-white-bg-removed.png"
                                    alt="Sultan Bazar — সুলতান বাজার"
                                    fill
                                    className="object-contain object-left"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* ── CENTER: Brand logo (mobile) + Nav links (desktop) ── */}
                    <Link href="/" aria-label="Sultan Bazar home" className="lg:hidden relative flex-1 h-16 min-w-0">
                        <Image src="/assets/logo-white-bg-removed.png" alt="Sultan Bazar — সুলতান বাজার" fill sizes="220px" className="object-contain" priority />
                    </Link>

                    <nav className="hidden lg:flex items-center gap-1">
                        {navLinks.slice(0, 1).map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-[#B5451B] hover:bg-orange-50 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Categories dropdown */}
                        <div
                            className="relative"
                            ref={catDropdownRef}
                            onMouseEnter={() => setCatDropdownOpen(true)}
                            onMouseLeave={() => setCatDropdownOpen(false)}
                        >
                            <button
                                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-[#B5451B] hover:bg-orange-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                            >
                                Categories
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catDropdownOpen ? "rotate-180" : ""}`} />
                            </button>

                            {catDropdownOpen && categories.length > 0 && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 overflow-hidden">
                                    <div className="grid grid-cols-2 gap-0.5 px-2">
                                        {categories.slice(0, 10).map((cat) => (
                                            <Link
                                                key={cat._id}
                                                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-orange-50 transition-colors group"
                                                onClick={() => setCatDropdownOpen(false)}
                                            >
                                                <div className="w-8 h-8 rounded-lg overflow-hidden bg-orange-50 flex-shrink-0 relative">
                                                    {cat.thumbnail ? (
                                                        <Image src={cat.thumbnail} alt={cat.name} fill className="object-cover" />
                                                    ) : (
                                                        <Package className="w-4 h-4 m-auto mt-2" style={{ color: "#B5451B" }} />
                                                    )}
                                                </div>
                                                <span className="text-xs font-medium text-gray-700 group-hover:text-[#B5451B] transition-colors line-clamp-1">
                                                    {cat.name}
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-2 mx-3 pt-2 border-t border-gray-100">
                                        <Link
                                            href="/shop"
                                            className="block text-center text-xs font-semibold py-1.5 rounded-lg hover:bg-orange-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B5451B]"
                                            style={{ color: "#B5451B" }}
                                            onClick={() => setCatDropdownOpen(false)}
                                        >
                                            View all categories
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {navLinks.slice(1).map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-[#B5451B] hover:bg-orange-50 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* ── RIGHT: Bell (mobile) + Cart + User (desktop) ── */}
                    <div className="flex items-center gap-1">
                        {/* Wishlist — mobile only */}
                        <Link
                            href="/wishlist"
                            className="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer transition-colors hover:bg-orange-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                            style={{ background: "#FDF6EC" }}
                            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
                        >
                            <Heart className="w-5 h-5 text-gray-700" />
                            {wishlistCount > 0 && (
                                <Badge
                                    className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] p-0 font-bold rounded-full border-2 border-white"
                                    style={{ background: "#D4860A", color: "white" }}
                                >
                                    {wishlistCount > 9 ? "9+" : wishlistCount}
                                </Badge>
                            )}
                        </Link>

                        {/* Cart */}
                        <Link
                            href="/cart"
                            className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors hover:bg-orange-50 cursor-pointer"
                            style={{ background: "#FDF6EC" }}
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-700" />
                            {cartLength > 0 && (
                                <Badge
                                    className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] p-0 font-bold rounded-full border-2 border-white"
                                    style={{ background: "#B5451B", color: "white" }}
                                >
                                    {cartLength > 9 ? "9+" : cartLength}
                                </Badge>
                            )}
                        </Link>

                        {/* User avatar — desktop only */}
                        {loggedIn ? (
                            <div className="hidden lg:block relative ml-1" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm transition-transform hover:scale-105 overflow-hidden"
                                    style={
                                        userPhoto
                                            ? {}
                                            : { background: "linear-gradient(135deg, #B5451B, #D4860A)" }
                                    }
                                    title={userName}
                                >
                                    {userPhoto ? (
                                        <Image
                                            src={userPhoto}
                                            alt={userName}
                                            width={36}
                                            height={36}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    ) : (
                                        userInitial
                                    )}
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                                        </div>
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setDropdownOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-[#B5451B] transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="hidden lg:block ml-1">
                                <Button
                                    size="sm"
                                    className="text-white text-xs rounded-full px-4 cursor-pointer"
                                    style={{ background: "#B5451B" }}
                                >
                                    <User className="w-3.5 h-3.5 mr-1" />
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
