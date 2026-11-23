"use client";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Promotion, useCreatePromotionMutation, useDeletePromotionMutation, useGetPromotionsQuery, useUpdatePromotionMutation } from "@/redux/api/promotionApi";

const unwrap = <T,>(value: unknown) => ((value as { data?: T })?.data ?? value) as T;
export default function PromotionsPage() {
  const { data, isLoading } = useGetPromotionsQuery();
  const [createPromotion, { isLoading: saving }] = useCreatePromotionMutation();
  const [updatePromotion] = useUpdatePromotionMutation(); const [deletePromotion] = useDeletePromotionMutation();
  const [code, setCode] = useState(""); const [name, setName] = useState("");
  const [type, setType] = useState<"percentage" | "fixed">("percentage"); const [value, setValue] = useState("10");
  const [minimumSubtotal, setMinimumSubtotal] = useState("0"); const [usageLimit, setUsageLimit] = useState("");
  const [perUserLimit, setPerUserLimit] = useState("1"); const [maxDiscount, setMaxDiscount] = useState(""); const [expiresAt, setExpiresAt] = useState("");
  const promotions = unwrap<Promotion[]>(data) ?? [];
  const submit = async (event: FormEvent) => { event.preventDefault(); try {
    await createPromotion({ code, name, type, value: Number(value), minimumSubtotal: Number(minimumSubtotal), usageLimit: usageLimit ? Number(usageLimit) : undefined, perUserLimit: Number(perUserLimit), maxDiscount: maxDiscount ? Number(maxDiscount) : undefined, expiresAt: expiresAt || undefined, isActive: true }).unwrap();
    setCode(""); setName(""); toast.success("Promotion created");
  } catch { toast.error("Could not create promotion"); } };
  return <main className="max-w-5xl space-y-7 p-6"><div><h1 className="text-3xl font-bold">Promotions</h1><p className="text-gray-500">Create server validated coupons and usage limits.</p></div>
    <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-5 md:grid-cols-3">
      <input aria-label="Coupon code" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Code" className="rounded-md border p-2 uppercase" />
      <input aria-label="Promotion name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-md border p-2" />
      <select aria-label="Discount type" value={type} onChange={(e) => setType(e.target.value as "percentage" | "fixed")} className="rounded-md border p-2"><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option></select>
      <input aria-label="Discount value" required min="0.01" step="0.01" type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Value" className="rounded-md border p-2" />
      <input aria-label="Minimum subtotal" min="0" type="number" value={minimumSubtotal} onChange={(e) => setMinimumSubtotal(e.target.value)} placeholder="Minimum subtotal" className="rounded-md border p-2" />
      <input aria-label="Total usage limit" min="1" type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="Total usage limit (optional)" className="rounded-md border p-2" />
      <input aria-label="Per customer usage limit" min="1" type="number" value={perUserLimit} onChange={(e) => setPerUserLimit(e.target.value)} placeholder="Per customer limit" className="rounded-md border p-2" />
      <input aria-label="Maximum discount" min="0" type="number" value={maxDiscount} onChange={(e) => setMaxDiscount(e.target.value)} placeholder="Maximum discount (optional)" className="rounded-md border p-2" />
      <input type="datetime-local" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="rounded-md border p-2" aria-label="Expiry date" />
      <Button disabled={saving} className="w-fit">{saving ? "Saving…" : "Create promotion"}</Button>
    </form>
    <div className="space-y-3">{isLoading ? <p>Loading…</p> : promotions.map((promotion) => <article key={promotion._id} className="flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4">
      <div className="flex-1"><h2 className="font-bold">{promotion.code} · {promotion.name}</h2><p className="text-sm text-gray-500">{promotion.type === "percentage" ? `${promotion.value}%` : `৳${promotion.value}`} off · minimum ৳{promotion.minimumSubtotal} · used {promotion.usedCount}{promotion.usageLimit ? `/${promotion.usageLimit}` : ""}</p></div>
      <Button variant="outline" onClick={() => updatePromotion({ id: promotion._id, data: { isActive: !promotion.isActive } })}>{promotion.isActive ? "Active" : "Inactive"}</Button>
      <Button variant="ghost" className="text-red-600" onClick={async () => { if (window.confirm(`Delete ${promotion.code}?`)) { await deletePromotion(promotion._id); } }}>Delete</Button>
    </article>)}</div>
  </main>;
}
