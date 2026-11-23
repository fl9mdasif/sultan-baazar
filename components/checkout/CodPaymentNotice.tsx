import { CheckCircle, CreditCard } from "lucide-react";

export function CodPaymentNotice() {
  return <section className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-orange-100 shadow-sm" aria-labelledby="payment-heading">
    <h3 id="payment-heading" className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8 tracking-tight">
      <span className="w-10 h-10 bg-[#B5451B] rounded-2xl flex items-center justify-center text-white shadow-lg"><CreditCard className="w-5 h-5" /></span>
      Payment Selection
    </h3>
    <div className="p-6 rounded-3xl border-2 border-[#B5451B] bg-orange-50/30">
      <div className="flex items-center gap-4"><span className="w-12 h-12 bg-[#B5451B] text-white rounded-2xl flex items-center justify-center"><CheckCircle className="w-6 h-6" /></span><div><p className="font-black text-gray-900">Cash On Delivery</p><p className="text-xs text-[#B5451B] font-bold uppercase mt-1">Available</p></div></div>
      <p className="mt-4 text-xs text-gray-500 font-medium">Pay with cash when your order arrives.</p>
    </div>
  </section>;
}
