"use client";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export default function ShowroomBanner() {
    return (
        <section className="my-10 rounded-2xl border border-orange-100 bg-[#FDF6EC] px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#B5451B] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-base" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                    আমাদের নিজস্ব শোরুম রয়েছে
                </p>
                <p className="text-sm text-gray-500 mt-0.5" style={{ overflowWrap: "break-word", minWidth: 0 }}>
                    অনলাইন সেবার পাশাপাশি সরাসরি আমাদের শোরুমে এসে পণ্য ও সেবা সম্পর্কে বিস্তারিত জানতে পারবেন।
                </p>
            </div>
            <Link
                href="/about"
                className="flex-shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-[#B5451B] hover:underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B] rounded-sm"
            >
                আমাদের সম্পর্কে জানুন
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
        </section>
    );
}
