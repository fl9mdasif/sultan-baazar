import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ConfirmDialog({ title, description, confirmLabel = "Delete", onConfirm, onCancel, loading }: { title: string; description: React.ReactNode; confirmLabel?: string; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"><div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
      <h3 id="confirm-title" className="text-lg font-bold text-gray-900 mb-1">{title}</h3><div className="text-sm text-gray-500 mb-5">{description}</div>
      <div className="flex gap-3"><Button variant="outline" onClick={onCancel} className="flex-1 rounded-xl">Cancel</Button><Button onClick={onConfirm} disabled={loading} className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : confirmLabel}</Button></div>
    </div>
  </div>;
}
