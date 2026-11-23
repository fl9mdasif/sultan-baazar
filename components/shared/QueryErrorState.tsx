import { Button } from "@/components/ui/button";

export function QueryErrorState({ message = "Could not load this content.", onRetry }: { message?: string; onRetry: () => void }) {
  return <div role="alert" className="min-h-[240px] flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50/40 p-8 text-center">
    <p className="font-semibold text-red-700">{message}</p>
    <Button type="button" variant="outline" onClick={onRetry}>Try again</Button>
  </div>;
}
