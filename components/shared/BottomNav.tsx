"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { hydrateWishlist } from "@/redux/features/wishlistSlice";
import { useGetCartQuery } from "@/redux/api/cartApi";
import { isLoggedIn } from "@/services/auth.services";

const TABS = [
    { icon: Home,         label: "হোম",       href: "/" },
    { icon: LayoutGrid,   label: "শপ", href: "/shop" },
    { icon: ShoppingCart, label: "কার্ট",      href: "/cart" },
    { icon: Heart,        label: "উইশলিস্ট",  href: "/wishlist" },
    { icon: User,         label: "প্রোফাইল",  href: "/dashboard" },
];

export default function BottomNav() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const userIsLoggedIn = isLoggedIn();
    const wishlistCount = useAppSelector(s => s.wishlist.items.length);
    const localCartCount = useAppSelector(s =>
        s.localCart.items.reduce((acc, i) => acc + i.quantity, 0)
    );
    const { data: cartData } = useGetCartQuery({}, { skip: !userIsLoggedIn });
    const cartCount = userIsLoggedIn ? (cartData?.items?.length ?? 0) : localCartCount;

    useEffect(() => { dispatch(hydrateWishlist()); }, [dispatch]);

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
            style={{
                background: "white",
                borderTop: "1px solid #F0E6D3",
                boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            }}
        >
            <div className="flex items-center justify-around px-2 py-2 pb-safe">
                {TABS.map((tab) => {
                    const isActive =
                        tab.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(tab.href);
                    const color = isActive ? "#B5451B" : "#6B7280";
                    const badge =
                        tab.href === "/cart" && cartCount > 0 ? cartCount :
                        tab.href === "/wishlist" && wishlistCount > 0 ? wishlistCount :
                        null;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className="relative flex flex-col items-center gap-0.5 py-1 px-2 cursor-pointer"
                        >
                            <div className="relative">
                                <tab.icon
                                    className="w-5 h-5 transition-colors"
                                    style={{ color }}
                                    fill={isActive && tab.href === "/" ? color : "none"}
                                />
                                {badge !== null && (
                                    <span
                                        className="absolute -top-1.5 -right-2 w-4 h-4 text-[9px] font-bold rounded-full text-white flex items-center justify-center"
                                        style={{ background: tab.href === "/wishlist" ? "#D4860A" : "#B5451B" }}
                                    >
                                        {badge > 9 ? "9+" : badge}
                                    </span>
                                )}
                            </div>
                            <span
                                className="font-bengali text-[9px] font-semibold leading-none transition-colors"
                                style={{ color }}
                            >
                                {tab.label}
                            </span>
                            {isActive && (
                                <span
                                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                                    style={{ background: "#B5451B" }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
