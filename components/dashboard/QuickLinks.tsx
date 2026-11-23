import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type QuickLink = { label: string; href: string; icon: LucideIcon; desc: string };

export default function QuickLinks({ title, links }: { title: string; links: QuickLink[] }) {
    return (
        <section className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 h-fit">
            <h2 className="text-base font-semibold text-gray-900 mb-2">{title}</h2>
            <ul className="divide-y divide-gray-100">
                {links.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className="flex items-center justify-between gap-3 py-3 rounded-sm group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B5451B]"
                        >
                            <span className="flex items-center gap-3 min-w-0">
                                <link.icon className="w-4 h-4 shrink-0 text-[#B5451B]" aria-hidden="true" />
                                <span className="min-w-0">
                                    <span className="block text-sm font-medium text-gray-900">{link.label}</span>
                                    <span className="block text-xs text-gray-500">{link.desc}</span>
                                </span>
                            </span>
                            <ChevronRight className="w-4 h-4 shrink-0 text-gray-300 group-hover:text-[#B5451B] transition-colors" aria-hidden="true" />
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}
