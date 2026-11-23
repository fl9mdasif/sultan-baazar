import type { LucideIcon } from "lucide-react";

export type StatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
};

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 min-w-0">
            <div className="flex items-center gap-1.5 text-gray-500">
                <Icon className="w-4 h-4 shrink-0" style={{ color }} aria-hidden="true" />
                <p className="text-xs font-medium truncate">{label}</p>
            </div>
            <p className="mt-1.5 text-lg sm:text-xl font-bold text-gray-900 truncate">{value}</p>
        </div>
    );
}

export const STAT_GRID = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2.5 sm:gap-4 mb-6 sm:mb-8";
