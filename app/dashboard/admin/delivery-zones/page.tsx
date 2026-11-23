"use client";

import { FormEvent, useRef, useState } from "react";
import { ChevronDown, Loader2, MapPin, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DeliveryZone,
  useCreateDeliveryZoneMutation,
  useDeleteDeliveryZoneMutation,
  useGetAdminDeliveryZonesQuery,
  useUpdateDeliveryZoneMutation,
} from "@/redux/api/deliveryZoneApi";
import { BANGLADESH_DISTRICTS } from "@/lib/bangladeshDistricts";

type ApiEnvelope<T> = { data?: T };
const unwrap = <T,>(value: unknown) => ((value as ApiEnvelope<T>)?.data ?? value) as T;

function DistrictPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggle = (d: string) =>
    onChange(selected.includes(d) ? selected.filter((x) => x !== d) : [...selected, d]);

  const label =
    selected.length === 0
      ? "Select districts"
      : selected.length === BANGLADESH_DISTRICTS.length
      ? "All districts selected"
      : `${selected.length} district${selected.length > 1 ? "s" : ""} selected`;

  return (
    <div className="relative col-span-full md:col-span-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-md border p-2 bg-white text-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={selected.length === 0 ? "text-gray-400" : ""}>{label}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-64 overflow-y-auto">
          <div className="sticky top-0 bg-white border-b flex gap-2 p-2">
            <button
              type="button"
              className="text-xs text-[#B5451B] font-semibold hover:underline"
              onClick={() => onChange([...BANGLADESH_DISTRICTS])}
            >
              Select all
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              className="text-xs text-gray-500 font-semibold hover:underline"
              onClick={() => onChange([])}
            >
              Clear
            </button>
          </div>
          <ul role="listbox" aria-multiselectable="true" className="py-1">
            {BANGLADESH_DISTRICTS.map((d) => (
              <li key={d} role="option" aria-selected={selected.includes(d)}>
                <label className="flex items-center gap-2 px-3 py-1.5 hover:bg-orange-50 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(d)}
                    onChange={() => toggle(d)}
                    className="accent-[#B5451B]"
                  />
                  {d}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function DeliveryZonesPage() {
  const { data, isLoading } = useGetAdminDeliveryZonesQuery();
  const [createZone, { isLoading: isCreating }] = useCreateDeliveryZoneMutation();
  const [updateZone] = useUpdateDeliveryZoneMutation();
  const [deleteZone] = useDeleteDeliveryZoneMutation();
  const [name, setName] = useState("");
  const [districts, setDistricts] = useState<string[]>([]);
  const [shippingCharge, setShippingCharge] = useState("60");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("50000");
  const [editingId, setEditingId] = useState<string | null>(null);
  const zones = unwrap<DeliveryZone[]>(data) ?? [];

  const create = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || districts.length === 0) return toast.error("Enter a zone name and select at least one district");
    try {
      const payload = { name: name.trim(), districts, shippingCharge: Number(shippingCharge), freeShippingThreshold: Number(freeShippingThreshold) };
      if (editingId) await updateZone({ id: editingId, data: payload }).unwrap(); else await createZone(payload).unwrap();
      setName(""); setDistricts([]); setEditingId(null); toast.success(editingId ? "Delivery zone updated" : "Delivery zone created");
    } catch { toast.error("Could not save delivery zone"); }
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
      <DistrictPicker selected={districts} onChange={setDistricts} />
      <input aria-label="Shipping charge" value={shippingCharge} onChange={(e) => setShippingCharge(e.target.value)} type="number" min="0" placeholder="Shipping charge" className="rounded-md border p-2" />
      <input aria-label="Free shipping threshold" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} type="number" min="0" placeholder="Free shipping threshold" className="rounded-md border p-2" />
      <Button disabled={isCreating} className="w-fit"><Plus /> {isCreating ? "Saving…" : editingId ? "Update delivery zone" : "Add delivery zone"}</Button>
    </form>
    {isLoading ? <Loader2 className="animate-spin" /> : <div className="space-y-3">{zones.map((zone) => <article key={zone._id} className="flex flex-wrap items-center gap-4 rounded-xl border p-4">
      <MapPin className="text-[#B5451B]" /><div className="flex-1"><h2 className="font-semibold">{zone.name}</h2><p className="text-sm text-gray-500">{zone.districts.join(", ")} · ৳{zone.shippingCharge} shipping · free from ৳{zone.freeShippingThreshold ?? 50000}</p></div>
      <Button variant="outline" onClick={() => { setEditingId(zone._id); setName(zone.name); setDistricts(zone.districts); setShippingCharge(String(zone.shippingCharge)); setFreeShippingThreshold(String(zone.freeShippingThreshold ?? 50000)); }}><Pencil className="w-4 h-4" /> Edit</Button>
      <Button variant="outline" onClick={() => toggleActive(zone)}>{zone.isActive ? "Active" : "Inactive"}</Button><Button variant="ghost" onClick={() => remove(zone)} aria-label={`Delete ${zone.name}`}><Trash2 className="text-red-600" /></Button>
    </article>)}</div>}
  </main>;
}
