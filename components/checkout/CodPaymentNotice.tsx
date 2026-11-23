import { Banknote } from "lucide-react";

export function CodPaymentNotice() {
  return (
    <section
      className="bg-white rounded-2xl sm:rounded-[2rem] p-5 sm:p-7 border border-orange-100 shadow-sm"
      aria-labelledby="payment-heading"
    >
      <h3
        id="payment-heading"
        className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5"
      >
        <span className="w-8 h-8 sm:w-9 sm:h-9 bg-[#B5451B] rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0">
          <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />
        </span>
        Payment method
      </h3>

      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex-1">
          <p className="text-sm sm:text-base font-black text-gray-900 leading-snug">
            Cash on delivery
          </p>
          <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">
            Pay with cash when your order arrives.
          </p>
        </div>
        <span className="mt-0.5 inline-block rounded-full bg-green-50 border border-green-200 px-2.5 py-1 text-[11px] font-bold text-green-700 leading-none flex-shrink-0">
          Available
        </span>
      </div>
    </section>
  );
}
