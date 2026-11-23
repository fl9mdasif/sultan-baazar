import { Button } from "@/components/ui/button";

type Props = { subtotal: number; shippingCharge: number; discount: number; deliveryAvailable: boolean; couponCode: string; validatingCoupon: boolean; onCouponChange: (value: string) => void; onApplyCoupon: () => void };

export function CheckoutTotals({ subtotal, shippingCharge, discount, deliveryAvailable, couponCode, validatingCoupon, onCouponChange, onApplyCoupon }: Props) {
  return <div className="p-5 sm:p-8 space-y-4 border-b border-orange-100" aria-live="polite">
    <div className="flex justify-between text-sm font-bold text-gray-500"><span>Subtotal</span><span className="text-gray-900">৳{subtotal}</span></div>
    <div className="flex justify-between text-sm font-bold text-gray-500"><span>Shipping</span><span className="text-gray-900">{deliveryAvailable ? `৳${shippingCharge}` : "Unavailable"}</span></div>
    <div className="flex gap-2"><label htmlFor="coupon-code" className="sr-only">Coupon code</label><input id="coupon-code" value={couponCode} onChange={(event) => onCouponChange(event.target.value.toUpperCase())} placeholder="Coupon code" className="min-w-0 flex-1 rounded-xl border border-orange-100 px-3 py-2 text-sm uppercase" /><Button type="button" variant="outline" disabled={validatingCoupon} onClick={onApplyCoupon}>Apply</Button></div>
    {discount > 0 && <div className="flex justify-between text-sm font-bold text-green-600"><span>Discount</span><span>-৳{discount}</span></div>}
    {!deliveryAvailable && <p role="alert" className="text-xs text-red-600">Delivery is not available in this district.</p>}
  </div>;
}
