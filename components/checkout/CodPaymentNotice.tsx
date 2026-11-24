import { CheckCircle, CreditCard } from "lucide-react";

export function CodPaymentNotice() {
  return <section className="bg-white rounded-2xl sm:rounded-[2.5rem] p-4 sm:p-8 border border-orange-100 shadow-sm" aria-labelledby="payment-heading">
    <h3 id="payment-heading" className="text-lg sm:text-2xl font-black text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8 tracking-tight">
      <span className="w-8 h-8 sm:w-10 sm:h-10 bg-[#B5451B] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-lg"><CreditCard className="w-4 h-4 sm:w-5 sm:h-5" /></span>
      Payment Selection
    </h3>
    <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 border-[#B5451B] bg-orange-50/30">
      <div className="flex items-center gap-3 sm:gap-4"><span className="w-10 h-10 sm:w-12 sm:h-12 bg-[#B5451B] text-white rounded-xl sm:rounded-2xl flex items-center justify-center"><CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /></span><div><p className="text-sm sm:text-base font-black text-gray-900">Cash On Delivery</p><p className="text-[10px] sm:text-xs text-[#B5451B] font-bold uppercase mt-1">Available</p></div></div>
      <p className="mt-3 sm:mt-4 text-xs text-gray-500 font-medium">Pay with cash when your order arrives.</p>
    </div>
  </section>;
}
