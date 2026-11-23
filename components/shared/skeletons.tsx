import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden flex flex-col" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="p-3 flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <div className="flex items-center justify-between mt-auto pt-1">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function CategoryPillSkeleton() {
    return (
        <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
            <Skeleton className="w-[68px] h-[68px] lg:w-32 lg:h-32 rounded-xl" />
            <Skeleton className="h-3 w-14" />
        </div>
    );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
    return (
        <tr className="border-b border-gray-50">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                    <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-3.5 w-28" />
                        <Skeleton className="h-2.5 w-16" />
                    </div>
                </div>
            </td>
            {Array.from({ length: cols - 2 }).map((_, i) => (
                <td key={i} className="px-4 py-4 hidden md:table-cell">
                    <Skeleton className="h-3.5 w-20" />
                </td>
            ))}
            <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-7 w-7 rounded-lg" />
                </div>
            </td>
        </tr>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100">
            <Skeleton className="h-3 w-20 mb-2" />
            <Skeleton className="h-6 w-14" />
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-56 w-full rounded-xl" />
        </div>
    );
}
