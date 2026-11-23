import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";
export type Promotion = { _id: string; code: string; name: string; type: "percentage" | "fixed"; value: number; maxDiscount?: number; minimumSubtotal: number; usageLimit?: number; perUserLimit: number; usedCount: number; startsAt?: string; expiresAt?: string; isActive: boolean };
export type PromotionInput = Omit<Promotion, "_id" | "usedCount" | "minimumSubtotal" | "perUserLimit"> & { minimumSubtotal?: number; perUserLimit?: number };
const api = baseApi.injectEndpoints({ endpoints: (build) => ({
  getPromotions: build.query<Promotion[], void>({ query: () => ({ url: "/promotions", method: "GET" }), providesTags: [tagTypes.promotions] }),
  createPromotion: build.mutation<Promotion, PromotionInput>({ query: (data) => ({ url: "/promotions", method: "POST", data }), invalidatesTags: [tagTypes.promotions] }),
  updatePromotion: build.mutation<Promotion, { id: string; data: Partial<PromotionInput> }>({ query: ({ id, data }) => ({ url: `/promotions/${id}`, method: "PATCH", data }), invalidatesTags: [tagTypes.promotions] }),
  deletePromotion: build.mutation<Promotion, string>({ query: (id) => ({ url: `/promotions/${id}`, method: "DELETE" }), invalidatesTags: [tagTypes.promotions] }),
  validatePromotion: build.mutation<{ discount: number }, { code: string; subtotal: number }>({ query: (data) => ({ url: "/promotions/validate", method: "POST", data }) }),
}) });
export const { useGetPromotionsQuery, useCreatePromotionMutation, useUpdatePromotionMutation, useDeletePromotionMutation, useValidatePromotionMutation } = api;
