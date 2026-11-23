import { Leaf, Truck, CheckCircle, Tag } from "lucide-react";

const badges = [
    { Icon: Leaf,         title: "100% Natural Ingredients", sub: "Farm to table freshness" },
    { Icon: Truck,        title: "Fast Home Delivery",       sub: "2–4 days across Bangladesh" },
    { Icon: CheckCircle,  title: "Quality Guaranteed",       sub: "Tested & certified products" },
    { Icon: Tag,          title: "Best Price Promise",       sub: "Directly from source" },
] as const;

export default function TrustBadges() {
    return (
        <div
            className="hidden md:block w-full py-4"
            style={{ background: "linear-gradient(90deg, var(--brand-primary), var(--brand-gold), var(--brand-primary))" }}
        >
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-0">
                    {badges.map((b, i) => (
                        <div
                            key={b.title}
                            className={`flex items-center gap-3 justify-center py-1 ${i < badges.length - 1 ? "lg:border-r lg:border-white/20" : ""}`}
                        >
                            <b.Icon className="w-6 h-6 text-white/90 flex-shrink-0" aria-hidden="true" />
                            <div className="text-white">
                                <p className="font-semibold text-sm leading-tight">{b.title}</p>
                                <p className="text-white/70 text-xs">{b.sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
