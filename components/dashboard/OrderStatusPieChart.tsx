"use client";

import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart } from "lucide-react";

type PieLabelProps = {
    cx?: number | string;
    cy?: number | string;
    midAngle?: number;
    outerRadius?: number | string;
    value?: number | string;
    name?: string;
};

export default function OrderStatusPieChart({ counts: statusCounts }: { counts: Record<string, number> }) {
    const COLORS: Record<string, string> = {
        pending: "#f59e0b",     // Amber
        confirmed: "#3b82f6",   // Blue
        processing: "#0d9488",  // Teal
        shipped: "#0ea5e9",     // Sky
        delivered: "#10b981",   // Emerald
        cancelled: "#ef4444",   // Red
        returned: "#6b7280",    // Gray
    };

    const data = Object.keys(statusCounts).filter((key) => statusCounts[key] > 0).map((key) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize
        value: statusCounts[key],
        rawKey: key
    }));

    // Sort so largest segment is first
    data.sort((a, b) => b.value - a.value);

    const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, value, name }: PieLabelProps) => {
        if (cx === undefined || cy === undefined || midAngle === undefined || outerRadius === undefined) return null;

        const RADIAN = Math.PI / 180;
        const centerX = Number(cx);
        const centerY = Number(cy);
        const radius = Number(outerRadius) + 25;
        const x = centerX + radius * Math.cos(-midAngle * RADIAN);
        const y = centerY + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="#4b5563"
                textAnchor={x > centerX ? 'start' : 'end'}
                dominantBaseline="central"
                className="text-[10px] font-bold"
            >
                {`${name} (${value})`}
            </text>
        );
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 flex flex-col h-full">
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#B5451B]" aria-hidden="true" />
                Order status
            </h2>

            {data.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 min-h-[250px]">
                    <PieChart className="w-10 h-10 opacity-20" />
                    <p className="font-medium text-sm">No orders yet.</p>
                </div>
            ) : (
                <div className="flex-1 min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="45%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                                label={renderCustomizedLabel}
                                labelLine={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[entry.rawKey] || "#cbd5e1"} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#374151', fontWeight: 'bold' }}
                                formatter={(value: number | string | undefined, name: string | undefined) => [value ?? "", name ?? ""]}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '11px', fontWeight: 500, paddingTop: '10px' }}
                            />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
