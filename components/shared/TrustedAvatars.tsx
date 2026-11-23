"use client";

import Image from "next/image";
import { useGetSocialProofUsersQuery, SocialProofUser } from "@/redux/api/userApi";

const FALLBACK_COLORS = ["#B5451B", "#7C3012", "#D4860A"];

const FALLBACK_USERS: SocialProofUser[] = [
    { _id: "a", username: "Sultan", role: "user" },
    { _id: "b", username: "Jahan", role: "user" },
    { _id: "c", username: "Karim", role: "user" },
];

type Props = {
    dark?: boolean;
    className?: string;
};

export function TrustedAvatars({ dark = false, className }: Props) {
    const { data: rawData } = useGetSocialProofUsersQuery();
    const fetched = (rawData as unknown as { data?: SocialProofUser[] })?.data ?? (rawData as unknown as SocialProofUser[] | undefined) ?? [];
    const users = fetched.length > 0 ? fetched.slice(0, 3) : FALLBACK_USERS;

    const textColor = dark ? "text-gray-900" : "text-white";
    const subColor = dark ? "text-gray-500" : "text-white/85";

    return (
        <div className={`flex items-center gap-3 ${className ?? ""}`}>
            <div className="flex -space-x-2.5">
                {users.map((user, i) => (
                    <span
                        key={user._id}
                        className="w-8 h-8 md:w-9 md:h-9 rounded-full ring-2 ring-white/30 overflow-hidden flex-shrink-0 relative inline-flex items-center justify-center"
                        style={{ background: FALLBACK_COLORS[i] }}
                        aria-hidden="true"
                    >
                        {user.profilePicture ? (
                            <Image
                                src={user.profilePicture}
                                alt={user.username}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <span className="text-xs font-black text-white select-none leading-none">
                                {user.username.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </span>
                ))}
            </div>
            <p className={`text-[11px] md:text-xs ${subColor} leading-snug font-medium`}>
                <span className={`font-black ${textColor}`}>Trusted</span> by 1K+ Sultans
            </p>
        </div>
    );
}
