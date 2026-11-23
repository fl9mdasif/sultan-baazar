"use client";

import { useState } from "react";
import { ActivityLog, useGetActivityLogsQuery } from "@/redux/api/activityLogApi";
import { TableRowSkeleton } from "@/components/shared/skeletons";
import Pagination from "@/components/shared/Pagination";

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetActivityLogsQuery({ page });
  const logs: ActivityLog[] = data?.data ?? [];
  const total = data?.meta?.total ?? logs.length;
  const limit = data?.meta?.limit ?? 30;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="max-w-6xl mx-auto space-y-5 p-4 sm:p-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin activity log</h1>
        <p className="text-sm text-gray-500 mt-1">Immutable record of administrative changes.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/70 text-xs font-semibold text-gray-500">
            <tr>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
            ) : isError ? (
              <tr><td className="px-4 py-10 text-center text-red-600" colSpan={4}>Failed to load activity logs.</td></tr>
            ) : logs.length === 0 ? (
              <tr><td className="px-4 py-10 text-center text-gray-500" colSpan={4}>No activity yet.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-900">{log.actor?.username ?? log.actor?.email ?? "Admin"}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{log.action}</td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{log.entityType} {log.entityId.slice(0, 8)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} total={total} limit={limit} onChange={setPage} />
    </main>
  );
}
