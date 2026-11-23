import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export type ActivityLog = { _id: string; action: string; entityType: string; entityId: string; actor?: { username?: string; email?: string }; createdAt: string; metadata?: Record<string, unknown> };
export type PageMeta = { page: number; limit: number; total: number };

const api = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getActivityLogs: build.query<{ data: ActivityLog[]; meta?: PageMeta }, { page?: number }>({
      query: ({ page = 1 }) => ({ url: "/activity-logs", method: "GET", params: { page, limit: 30 } }),
      transformResponse: (data: ActivityLog[], meta: unknown) => ({ data, meta: meta as PageMeta | undefined }),
      providesTags: [tagTypes.activityLogs],
    }),
  }),
});
export const { useGetActivityLogsQuery } = api;
