"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
    page: number;
    totalPages: number;
    total?: number;
    limit?: number;
    onChange: (page: number) => void;
};

const pageWindow = (page: number, totalPages: number): (number | "gap")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    const sorted = [...pages].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
    const out: (number | "gap")[] = [];
    sorted.forEach((n, i) => {
        if (i > 0 && n - sorted[i - 1] > 1) out.push("gap");
        out.push(n);
    });
    return out;
};

const base =
    "min-w-10 h-10 px-2 rounded-lg border text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]";

export default function Pagination({ page, totalPages, total, limit, onChange }: Props) {
    if (totalPages <= 1) return null;
    const from = total && limit ? (page - 1) * limit + 1 : null;
    const to = total && limit ? Math.min(page * limit, total) : null;

    return (
        <nav aria-label="Pagination" className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
            <p className="text-sm text-gray-500">
                {from !== null && to !== null ? `Showing ${from}–${to} of ${total}` : `Page ${page} of ${totalPages}`}
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => onChange(Math.max(1, page - 1))}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className={`${base} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center`}
                >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                </button>
                {pageWindow(page, totalPages).map((n, i) =>
                    n === "gap" ? (
                        <span key={`gap-${i}`} className="px-1 text-gray-400" aria-hidden="true">…</span>
                    ) : (
                        <button
                            key={n}
                            type="button"
                            onClick={() => onChange(n)}
                            aria-label={`Page ${n}`}
                            aria-current={n === page ? "page" : undefined}
                            className={`${base} ${n === page ? "bg-[#B5451B] border-[#B5451B] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
                        >
                            {n}
                        </button>
                    )
                )}
                <button
                    type="button"
                    onClick={() => onChange(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    aria-label="Next page"
                    className={`${base} border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center`}
                >
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
            </div>
        </nav>
    );
}
