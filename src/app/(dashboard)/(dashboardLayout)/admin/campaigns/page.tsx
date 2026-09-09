"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  CirclePause,
  Megaphone,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetAllProductsQuery } from "@/redux/featured/products/productsApi";
import {
  Campaign,
  CampaignStatus,
  CampaignType,
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
  useGetCampaignsQuery,
  useUpdateCampaignStatusMutation,
} from "@/redux/featured/campaigns/campaignApi";

const statusStyles: Record<CampaignStatus, string> = {
  draft: "bg-slate-100 text-slate-700",
  scheduled: "bg-blue-100 text-blue-700",
  active: "bg-emerald-100 text-emerald-700",
  paused: "bg-amber-100 text-amber-700",
  expired: "bg-red-100 text-red-700",
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading, isError } = useGetCampaignsQuery();
  const { data: allProducts = [] } = useGetAllProductsQuery({ page: 1, limit: 50000 });
  const [createCampaign, { isLoading: isCreating, error: createError }] =
    useCreateCampaignMutation();
  const [updateCampaignStatus] = useUpdateCampaignStatusMutation();
  const [deleteCampaign] = useDeleteCampaignMutation();
  const [activeTab, setActiveTab] = useState<"All" | CampaignType>("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [form, setForm] = useState({
    name: "",
    type: "flash-sale" as CampaignType,
    discount: "",
    startAt: "",
    endAt: "",
    stock: "",
  });

  const filteredCampaigns = useMemo(
    () => campaigns.filter((campaign) =>
      (activeTab === "All" || campaign.type === activeTab) &&
      campaign.name.toLowerCase().includes(search.toLowerCase())
    ),
    [activeTab, campaigns, search]
  );

  const toggleCampaign = (campaign: Campaign) =>
    updateCampaignStatus({
      id: campaign._id,
      status: campaign.status === "paused" ? "active" : "paused",
    });

  const submitCampaign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const discount = Number(form.discount);
    if (!Number.isFinite(discount) || discount < 0) return;
    const selected = allProducts.filter((product) => selectedProducts.includes(product._id));
    await createCampaign({
      name: form.name,
      type: form.type,
      startAt: new Date(form.startAt).toISOString(),
      endAt: new Date(form.endAt).toISOString(),
      products: selected.map((product) => ({
        productId: product._id,
        discountType: "percentage",
        discountValue: discount,
        salePrice: Number((product.productInfo.price * (1 - discount / 100)).toFixed(2)),
        stockLimit: Math.min(Number(form.stock) || 0, product.productInfo.quantity),
      })),
    }).unwrap();
    setForm({
      name: "",
      type: "flash-sale",
      discount: "",
      startAt: "",
      endAt: "",
      stock: "",
    });
    setSelectedProducts([]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6 p-2 py-6 sm:p-4">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Megaphone className="text-blue-600" size={25} />
            <h1 className="text-2xl font-semibold">Campaign Management</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Schedule flash sales and deals without changing the regular product price.
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus size={17} /> Create Campaign
        </Button>
      </div>
      {isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Campaigns could not be loaded. Please check the backend connection.
        </p>
      )}
      {createError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          Campaign could not be saved. Check the selected products and schedule.
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Total campaigns", campaigns.length, "text-gray-900"],
          ["Active now", campaigns.filter((c) => c.status === "active").length, "text-emerald-600"],
          ["Scheduled", campaigns.filter((c) => c.status === "scheduled").length, "text-blue-600"],
          ["Products on deal", campaigns.reduce((sum, c) => sum + c.products.length, 0), "text-purple-600"],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-lg border bg-white p-4">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
            {(["All", "flash-sale", "deal-of-day"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-2 text-sm ${activeTab === tab ? "bg-white font-medium shadow-sm" : "text-gray-500"}`}
              >
                {tab === "All" ? "All" : tab === "flash-sale" ? "Flash Sale" : "Deal of the Day"}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={17} />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search campaigns..." className="pl-9" />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b text-xs uppercase text-gray-400">
              <tr>
                <th className="px-3 py-3">Campaign</th>
                <th className="px-3 py-3">Type</th>
                <th className="px-3 py-3">Schedule</th>
                <th className="px-3 py-3">Discount</th>
                <th className="px-3 py-3">Products / Stock</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign._id} className="border-b last:border-0">
                  <td className="px-3 py-4 font-medium">{campaign.name}</td>
                  <td className="px-3 py-4">{campaign.type === "flash-sale" ? "Flash Sale" : "Deal of the Day"}</td>
                  <td className="px-3 py-4 text-gray-500">
                    <div>{formatDate(campaign.startAt)}</div>
                    <div className="text-xs">to {formatDate(campaign.endAt)}</div>
                  </td>
                  <td className="px-3 py-4 font-medium text-blue-600">
                    {campaign.products[0]?.discountValue ?? 0}% off
                  </td>
                  <td className="px-3 py-4">
                    {campaign.products.length} products ·{" "}
                    {campaign.products.reduce(
                      (sum, product) => sum + product.stockLimit - (product.soldQuantity ?? 0),
                      0
                    )} left
                  </td>
                  <td className="px-3 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[campaign.status]}`}>{campaign.status}</span></td>
                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" title="Pause or resume" onClick={() => toggleCampaign(campaign)}><CirclePause size={17} /></Button>
                      <Button variant="ghost" size="icon" title="Delete" onClick={() => deleteCampaign(campaign._id)}><Trash2 size={17} className="text-red-500" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading ? (
            <p className="py-10 text-center text-sm text-gray-500">Loading campaigns...</p>
          ) : filteredCampaigns.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">No campaigns found.</p>
          ) : null}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={submitCampaign} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <div><h2 className="text-xl font-semibold">Create Campaign</h2><p className="text-sm text-gray-500">Set the offer, products and schedule.</p></div>
              <button type="button" onClick={() => setShowForm(false)} aria-label="Close"><X /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">Campaign name<Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Friday Flash Sale" className="mt-1" /></label>
              <label className="text-sm font-medium">Campaign type<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CampaignType })} className="mt-1 h-9 w-full rounded-md border px-3 text-sm"><option value="flash-sale">Flash Sale</option><option value="deal-of-day">Deal of the Day</option></select></label>
              <label className="text-sm font-medium">Discount percentage<Input required type="number" min="0" max="100" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} placeholder="e.g. 25" className="mt-1" /></label>
              <label className="text-sm font-medium">Campaign stock limit<Input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="e.g. 100" className="mt-1" /></label>
              <label className="text-sm font-medium">Starts at<Input required type="datetime-local" value={form.startAt} onChange={(e) => setForm({ ...form, startAt: e.target.value })} className="mt-1" /></label>
              <label className="text-sm font-medium">Ends at<Input required type="datetime-local" value={form.endAt} onChange={(e) => setForm({ ...form, endAt: e.target.value })} className="mt-1" /></label>
            </div>
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium">Select products ({selectedProducts.length})</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {allProducts.filter((product) => product.description?.status === "publish").map((product) => {
                  const selected = selectedProducts.includes(product._id);
                  return <button type="button" key={product._id} onClick={() => setSelectedProducts((current) => selected ? current.filter((item) => item !== product._id) : [...current, product._id])} className={`flex items-center justify-between rounded-md border p-3 text-left text-sm ${selected ? "border-blue-500 bg-blue-50 text-blue-700" : "hover:bg-gray-50"}`}>{product.description.name} · ৳{product.productInfo.price}{selected ? <Check size={17} /> : <ChevronDown size={17} className="text-gray-400" />}</button>;
                })}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" disabled={selectedProducts.length === 0 || isCreating}><CalendarDays size={17} /> {isCreating ? "Saving..." : "Schedule Campaign"}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
