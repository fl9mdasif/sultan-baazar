import { Star } from "lucide-react";

const reviews = [
    {
        stars: 5,
        text: "Sultan এর সরিষার তেলের গন্ধ একদম আসল। বাড়িতে সবাই পছন্দ করেছে।",
        name: "Fatema B.",
        location: "Dhaka",
        color: "#B5451B",
    },
    {
        stars: 5,
        text: "বিরিয়ানি মশলা দিয়ে রান্না করলে হোটেলের মতো স্বাদ হয়! অসাধারণ প্রোডাক্ট।",
        name: "Karim H.",
        location: "Chittagong",
        color: "#0369A1",
    },
    {
        stars: 4,
        text: "Packaging was very neat and delivery was fast. Will order again without hesitation.",
        name: "Nasrin A.",
        location: "Sylhet",
        color: "#7C3AED",
    },
    {
        stars: 5,
        text: "Chia seeds quality is excellent and the price is also very reasonable. Highly recommended!",
        name: "Rahman F.",
        location: "Rajshahi",
        color: "#059669",
    },
    {
        stars: 5,
        text: "Isphahani চা এর আসল স্বাদ পাচ্ছি। অনেক ভালো লেগেছে। নিয়মিত কিনব।",
        name: "Sumaiya K.",
        location: "Kushtia",
        color: "#DC2626",
    },
    {
        stars: 5,
        text: "Sultan বাজার থেকে প্রতি মাসে অর্ডার করি। কখনো হতাশ হইনি। ধন্যবাদ।",
        name: "Tariqul I.",
        location: "Barishal",
        color: "#D4860A",
    },
];

function ReviewCard({ review }: { review: (typeof reviews)[0] }) {
    const initial = review.name.charAt(0).toUpperCase();
    return (
        <div
            className="flex-shrink-0 bg-white rounded-2xl p-4 shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md"
            style={{ minWidth: 210, maxWidth: 240, border: "1.5px solid #F0E6D3" }}
        >
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i <= review.stars ? "#D4860A" : "none"}
                        stroke={i <= review.stars ? "#D4860A" : "#ccc"}
                    />
                ))}
            </div>

            {/* Text */}
            <p className="font-bengali text-gray-700 text-sm leading-relaxed mb-4 italic">
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
                {/* Colored initial avatar */}
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: review.color }}
                >
                    {initial}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-gray-800">{review.name}</p>
                        <span
                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: "#DCFCE7", color: "#16A34A" }}
                        >
                            ✓ Verified
                        </span>
                    </div>
                    <p className="text-xs text-gray-400">📍 {review.location}</p>
                </div>
            </div>
        </div>
    );
}

export default function Reviews() {
    return (
        <section className="py-8 lg:py-12" style={{ background: "var(--brand-cream)" }}>
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="font-bengali text-[22px] lg:text-3xl font-bold text-gray-900 leading-snug">
                            আমাদের <span style={{ color: "var(--brand-primary)" }}>সন্তুষ্ট গ্রাহকরা</span>
                        </h2>
                        <p className="text-gray-500 text-xs mt-0.5">Real feedback from real customers</p>
                    </div>
                </div>
            </div>

            {/* Auto-scrolling marquee */}
            <div className="overflow-hidden">
                <div className="flex gap-3 w-max animate-marquee hover:[animation-play-state:paused]">
                    {[...reviews, ...reviews].map((review, i) => (
                        <ReviewCard key={i} review={review} />
                    ))}
                </div>
            </div>
        </section>
    );
}
