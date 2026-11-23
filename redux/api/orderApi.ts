import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
import type { TOrder } from "@/types/common";

const orderApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        // Create / Place Order (User)
        placeOrder: build.mutation({
            query: (data) => ({
                url: "/orders",
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.orders, tagTypes.cart],
        }),

        // Get All Orders (Admin)
        getAllOrders: build.query<{ data: TOrder[]; meta?: { page: number; limit: number; total: number } }, Record<string, unknown> | undefined>({
            query: (params) => ({
                url: "/orders",
                method: "GET",
                params,
            }),
            transformResponse: (data: TOrder[], meta: unknown) => ({ data, meta: meta as { page: number; limit: number; total: number } | undefined }),
            providesTags: [tagTypes.orders],
        }),

        getOrderSummary: build.query<{ total: number; counts: Record<string, number>; revenue: number }, void>({
            query: () => ({ url: "/orders/analytics/summary", method: "GET" }),
            providesTags: [tagTypes.orders],
        }),

        // Get Sales Analytics (Admin)
        getSalesAnalytics: build.query<unknown, { period?: string; from?: string; to?: string }>({
            query: ({ period = 'monthly', from, to } = {}) => ({
                url: `/orders/analytics/sales?period=${period}${from ? `&from=${from}` : ''}${to ? `&to=${to}` : ''}`,
                method: "GET",
            }),
            providesTags: [tagTypes.orders],
        }),

        // Get My Orders (User)
        getMyOrders: build.query({
            query: () => ({
                url: "/orders/my-orders",
                method: "GET",
            }),
            providesTags: [tagTypes.orders],
        }),

        // Get Single Order
        getSingleOrder: build.query({
            query: (id) => ({
                url: `/orders/${id}`,
                method: "GET",
            }),
            providesTags: [tagTypes.orders],
        }),

        // Update Order Lifecycle Status (Admin)
        updateOrderStatus: build.mutation({
            query: ({ id, data }) => ({
                url: `/orders/${id}/status`,
                method: "PATCH",
                data, // { status: "processing", note: "..." }
            }),
            invalidatesTags: [tagTypes.orders],

        }),

        // Update Payment Status (Admin)
        updatePaymentStatus: build.mutation({
            query: ({ id, data }) => ({
                url: `/orders/${id}/payment-status`,
                method: "PATCH",
                data, // { paymentStatus: "paid" }
            }),
            invalidatesTags: [tagTypes.orders],

        }),

        // Cancel Order (User/Admin)
        cancelOrder: build.mutation({
            query: ({ id, data }) => ({
                url: `/orders/${id}/cancel`,
                method: "PATCH",
                data, // { reason: "..." }
            }),
            invalidatesTags: [tagTypes.orders],

        }),
        requestReturn: build.mutation({
            query: ({ id, reason }) => ({ url: `/orders/${id}/return-request`, method: "POST", data: { reason } }),
            invalidatesTags: [tagTypes.orders],
        }),
        reviewReturn: build.mutation({
            query: ({ id, action, note }) => ({ url: `/orders/${id}/return-request/review`, method: "PATCH", data: { action, note } }),
            invalidatesTags: [tagTypes.orders],
        }),
    }),
});

export const {
    usePlaceOrderMutation,
    useGetAllOrdersQuery,
    useGetOrderSummaryQuery,
    useGetSalesAnalyticsQuery,
    useGetMyOrdersQuery,
    useGetSingleOrderQuery,
    useUpdateOrderStatusMutation,
    useUpdatePaymentStatusMutation,
    useCancelOrderMutation,
    useRequestReturnMutation,
    useReviewReturnMutation,
} = orderApi;
