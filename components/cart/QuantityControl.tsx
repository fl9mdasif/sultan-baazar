import { Loader2, Minus, Plus } from "lucide-react";

export function QuantityControl({ quantity, stock, loading = false, onChange }: { quantity: number; stock: number; loading?: boolean; onChange: (quantity: number) => void }) {
  return <div className="flex items-center gap-2 sm:gap-3 bg-white border border-orange-100 rounded-full p-0.5 sm:p-1 shadow-sm" aria-label="Quantity controls">
    <button type="button" aria-label="Decrease quantity" onClick={() => onChange(quantity - 1)} disabled={quantity <= 1 || loading} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-orange-50 disabled:opacity-30"><Minus className="w-3.5 h-3.5" /></button>
    <span className="w-6 text-center font-bold text-gray-900 text-sm" aria-live="polite">{loading ? <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" /> : quantity}</span>
    <button type="button" aria-label="Increase quantity" onClick={() => onChange(quantity + 1)} disabled={quantity >= stock || loading} className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-orange-50 disabled:opacity-30"><Plus className="w-3.5 h-3.5" /></button>
  </div>;
}
