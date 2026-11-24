import { Truck, Leaf, Wallet, Star } from "lucide-react";

const badges = [
    {
        type: "rating" as const,
        title: "৪.৯/৫ রেটিং",
        sub: "১২,০০০+ সন্তুষ্ট গ্রাহক",
    },
    {
        type: "normal" as const,
        Icon: Wallet,
        iconBg: "rgba(181,69,27,0.12)",
        iconColor: "#B5451B",
        title: "ক্যাশ অন ডেলিভারি",
        sub: "ঘরে এসে পেমেন্ট নিই",
    },
    {
        type: "normal" as const,
        Icon: Leaf,
        iconBg: "rgba(181,69,27,0.12)",
        iconColor: "#B5451B",
        title: "১০০% খাঁটি পণ্য",
        sub: "কোনো ভেজাল নেই",
    },
    {
        type: "normal" as const,
        Icon: Truck,
        iconBg: "rgba(181,69,27,0.12)",
        iconColor: "#B5451B",
        title: "দ্রুত ডেলিভারি",
        sub: "সারা বাংলাদেশে ১–২ দিনে",
    },
] as const;

function RatingCard() {
    return (
        <div className="flex items-center gap-2.5 bg-white rounded-2xl shadow-md px-4 py-2.5 border border-orange-100">
            <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "rgba(181,69,27,0.12)" }}>
                <Star className="w-5 h-5" style={{ color: "#B5451B", fill: "#B5451B" }} />
            </div>
            <div>
                <p className="font-bengali font-black text-gray-900 text-sm leading-tight">
                    <span className="text-base">৪.৯</span>
                    <span className="text-gray-400 font-semibold text-xs">/৫ রেটিং</span>
                </p>
                <p className="font-bengali text-[10px] text-gray-500 leading-tight">১২,০০০+ সন্তুষ্ট গ্রাহক</p>
            </div>
        </div>
    );
}

function NormalBadge({ Icon, iconBg, iconColor, title, sub }: {
    Icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    title: string;
    sub: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: iconBg }}
            >
                <Icon className="w-5 h-5 flex-shrink-0" style={{ color: iconColor }} />
            </div>
            <div>
                <p className="font-bengali font-bold text-sm text-gray-900 leading-tight whitespace-nowrap">{title}</p>
                <p className="font-bengali text-[11px] text-gray-500 leading-tight whitespace-nowrap">{sub}</p>
            </div>
        </div>
    );
}

export default function TrustBadges() {
    return (
        <div className="md:hidden w-full border-y border-orange-100 bg-[#FAFAF8] overflow-hidden">
            <style>{`
                @keyframes trust-marquee {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .trust-track {
                    animation: trust-marquee 32s linear infinite;
                }
                .trust-track:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="trust-track flex items-center w-max">
                {[0, 1].map((pass) => (
                    <div key={pass} className="flex items-center">
                        {badges.map((b, i) => (
                            <div key={`${pass}-${i}`} className="flex items-center">
                                <div className="px-7 py-3.5">
                                    {b.type === "rating" ? (
                                        <RatingCard />
                                    ) : (
                                        <NormalBadge
                                            Icon={b.Icon}
                                            iconBg={b.iconBg}
                                            iconColor={b.iconColor}
                                            title={b.title}
                                            sub={b.sub}
                                        />
                                    )}
                                </div>
                                <div className="w-px h-8 bg-orange-100 flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
