import { useMemo } from "react";
import type { DeliveryZone } from "@/redux/api/deliveryZoneApi";

const envPrice = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export function useCheckoutPricing(subtotal: number, district: string, zones: DeliveryZone[], discount: number) {
  return useMemo(() => {
    const activeZones = zones.filter((z) => z.isActive !== false);

    const selectedZone = activeZones.find((zone) =>
      zone.districts.some((d) => d.toLowerCase() === district.trim().toLowerCase())
    );

    const catchAllZone = activeZones.find((zone) =>
      zone.name.toLowerCase() === "bangladesh" ||
      zone.districts.some((d) => d === "*" || d.toLowerCase() === "bangladesh")
    );

    const resolvedZone = selectedZone ?? catchAllZone;
    const isDeliveryAvailable = activeZones.length === 0 || Boolean(resolvedZone);
    const threshold = resolvedZone?.freeShippingThreshold ?? envPrice(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD, 50000);
    const rate = resolvedZone?.shippingCharge ?? envPrice(process.env.NEXT_PUBLIC_SHIPPING_CHARGE, 60);
    const shippingCharge = subtotal > 0 && isDeliveryAvailable && subtotal < threshold ? rate : 0;
    return { selectedZone: resolvedZone, isDeliveryAvailable, shippingCharge, total: subtotal - discount + shippingCharge };
  }, [discount, district, subtotal, zones]);
}
