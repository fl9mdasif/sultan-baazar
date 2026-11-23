"use client";

import { FormEvent, useState } from "react";
import { Loader2, MapPin, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DeliveryZone,
  useCreateDeliveryZoneMutation,
  useDeleteDeliveryZoneMutation,
  useGetAdminDeliveryZonesQuery,
  useUpdateDeliveryZoneMutation,
} from "@/redux/api/deliveryZoneApi";

type ApiEnvelope<T> = { data?: T };
const unwrap = <T,>(value: unknown) => ((value as ApiEnvelope<T>)?.data ?? value) as T;

export default function DeliveryZonesPage() {
  const { data, isLoading } = useGetAdminDeliveryZonesQuery();
  const [createZone, { isLoading: isCreating }] = useCreateDeliveryZoneMutation();
  const [updateZone] = useUpdateDeliveryZoneMutation();
  const [deleteZone] = useDeleteDeliveryZoneMutation();
  const [name, setName] = useState("");
  const [districts, setDistricts] = useState("");
  const [shippingCharge, setShippingCharge] = useState("60");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("50000");
  const [editingId, setEditingId] = useState<string | null>(null);
  const zones = unwrap<DeliveryZone[]>(data) ?? [];

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const areaNames = districts.split(",").map((value) => value.trim()).filter(Boolean);
    if (!name.trim() || areaNames.length === 0) return toast.error("Enter a zone name and at least one district");
    try {
      const payload = { name: name.trim(), districts: areaNames, shippingCharge: Number(shippingCharge), freeShippingThreshold: Number(freeShippingThreshold) };
      if (editingId) await updateZone({ id: editingId, data: payload }).unwrap(); else await createZone(payload).unwrap();
      setName(""); setDistricts(""); setEditingId(null); toast.success(editingId ? "Delivery zone updated" : "Delivery zone created");
    } catch { toast.error("Could not create delivery zone"); }
  };

  const toggleActive = async (zone: DeliveryZone) => {
    try { await updateZone({ id: zone._id, data: { isActive: !zone.isActive } }).unwrap(); }
    catch { toast.error("Could not update delivery zone"); }
  };

  const remove = async (zone: DeliveryZone) => {
    if (!window.confirm(`Delete ${zone.name}?`)) return;
    try { await deleteZone(zone._id).unwrap(); toast.success("Delivery zone deleted"); }
    catch { toast.error("Could not delete delivery zone"); }
  };

  return <main className="p-6 max-w-5xl space-y-8">
    <div><h1 className="text-3xl font-bold">Delivery Zones</h1><p className="text-gray-500">Set district coverage and server-enforced shipping prices.</p></div>
    <form onSubmit={create} className="grid gap-3 rounded-xl border bg-white p-5 md:grid-cols-2">
      <input aria-label="Zone name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Zone name (e.g. Dhaka Metro)" className="rounded-md border p-2" />
      <input aria-label="Districts" value={districts} onChange={(e) => setDistricts(e.target.value)} placeholder="Districts, comma separated" className="rounded-md border p-2" />
      <input aria-label="Shipping charge" value={shippingCharge} onChange={(e) => setShippingCharge(e.target.value)} type="number" min="0" placeholder="Shipping charge" className="rounded-md border p-2" />
      <input aria-label="Free shipping threshold" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} type="number" min="0" placeholder="Free shipping threshold" className="rounded-md border p-2" />
      <Button disabled={isCreating} className="w-fit"><Plus /> {isCreating ? "Saving…" : editingId ? "Update delivery zone" : "Add delivery zone"}</Button>
    </form>
    {isLoading ? <Loader2 className="animate-spin" /> : <div className="space-y-3">{zones.map((zone) => <article key={zone._id} className="flex flex-wrap items-center gap-4 rounded-xl border p-4">
      <MapPin className="text-[#B5451B]" /><div className="flex-1"><h2 className="font-semibold">{zone.name}</h2><p className="text-sm text-gray-500">{zone.districts.join(", ")} · ৳{zone.shippingCharge} shipping · free from ৳{zone.freeShippingThreshold ?? 50000}</p></div>
      <Button variant="outline" onClick={() => { setEditingId(zone._id); setName(zone.name); setDistricts(zone.districts.join(", ")); setShippingCharge(String(zone.shippingCharge)); setFreeShippingThreshold(String(zone.freeShippingThreshold ?? 50000)); }}><Pencil className="w-4 h-4" /> Edit</Button>
      <Button variant="outline" onClick={() => toggleActive(zone)}>{zone.isActive ? "Active" : "Inactive"}</Button><Button variant="ghost" onClick={() => remove(zone)} aria-label={`Delete ${zone.name}`}><Trash2 className="text-red-600" /></Button>
    </article>)}</div>}
  </main>;
}
