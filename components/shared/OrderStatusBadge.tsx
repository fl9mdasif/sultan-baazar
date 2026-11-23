import type { TOrderStatus } from "@/types/common";

const colors: Record<TOrderStatus, string> = {
    pending: "bg-orange-50 text-orange-700 border-orange-200",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200",
    processing: "bg-blue-50 text-blue-700 border-blue-200",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
    delivered: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    returned: "bg-gray-100 text-gray-700 border-gray-200",
};

export function OrderStatusBadge({ status }: { status: TOrderStatus }) {
    return (
        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap border ${colors[status]}`}>
            {status}
        </span>
    );
}
