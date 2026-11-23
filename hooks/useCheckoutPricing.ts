import { useMemo } from "react";
import type { DeliveryZone } from "@/redux/api/deliveryZoneApi";

const envPrice = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export function useCheckoutPricing(subtotal: number, district: string, zones: DeliveryZone[], discount: number) {
  return useMemo(() => {
    const selectedZone = zones.find((zone) => zone.districts.some((item) => item.toLowerCase() === district.trim().toLowerCase()));
    const isDeliveryAvailable = zones.length === 0 || Boolean(selectedZone);
    const threshold = selectedZone?.freeShippingThreshold ?? envPrice(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD, 50000);
    const rate = selectedZone?.shippingCharge ?? envPrice(process.env.NEXT_PUBLIC_SHIPPING_CHARGE, 60);
    const shippingCharge = subtotal > 0 && isDeliveryAvailable && subtotal < threshold ? rate : 0;
    return { selectedZone, isDeliveryAvailable, shippingCharge, total: subtotal - discount + shippingCharge };
  }, [discount, district, subtotal, zones]);
}
