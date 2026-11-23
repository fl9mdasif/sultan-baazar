import { tagTypes } from "../tag-types";
import { baseApi } from "./baseApi";

export type DeliveryZonePayload = {
  name: string;
  districts: string[];
  shippingCharge: number;
  freeShippingThreshold?: number;
  isActive?: boolean;
};

export type DeliveryZone = DeliveryZonePayload & { _id: string };

const deliveryZoneApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getDeliveryZones: build.query<DeliveryZone[], void>({
      query: () => ({ url: "/delivery-zones", method: "GET" }),
      providesTags: [tagTypes.deliveryZones],
    }),
    getAdminDeliveryZones: build.query<DeliveryZone[], void>({
      query: () => ({ url: "/delivery-zones/admin", method: "GET" }),
      providesTags: [tagTypes.deliveryZones],
    }),
    createDeliveryZone: build.mutation<DeliveryZone, DeliveryZonePayload>({
      query: (data) => ({ url: "/delivery-zones", method: "POST", data }),
      invalidatesTags: [tagTypes.deliveryZones],
    }),
    updateDeliveryZone: build.mutation<DeliveryZone, { id: string; data: Partial<DeliveryZonePayload> }>({
      query: ({ id, data }) => ({ url: `/delivery-zones/${id}`, method: "PATCH", data }),
      invalidatesTags: [tagTypes.deliveryZones],
    }),
    deleteDeliveryZone: build.mutation<DeliveryZone, string>({
      query: (id) => ({ url: `/delivery-zones/${id}`, method: "DELETE" }),
      invalidatesTags: [tagTypes.deliveryZones],
    }),
  }),
});

export const {
  useGetDeliveryZonesQuery,
  useGetAdminDeliveryZonesQuery,
  useCreateDeliveryZoneMutation,
  useUpdateDeliveryZoneMutation,
  useDeleteDeliveryZoneMutation,
} = deliveryZoneApi;
