"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MobileSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    };

    return (
        <div className="md:hidden flex gap-2.5 pt-3 pb-1">
            <form
                onSubmit={handleSubmit}
                className="flex-1 flex items-center gap-2.5 bg-white rounded-full px-4 py-3"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
            >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: "#B5451B" }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="পণ্য খুঁজুন..."
                    className="flex-1 bg-transparent text-sm outline-none font-bengali text-gray-700 placeholder:text-gray-400"
                />
            </form>
            <button
                onClick={() => router.push("/shop")}
                className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-white rounded-2xl cursor-pointer transition-colors hover:bg-orange-50"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}
                aria-label="Filter products"
            >
                <SlidersHorizontal className="w-4.5 h-4.5" style={{ color: "#B5451B" }} />
            </button>
        </div>
    );
}
