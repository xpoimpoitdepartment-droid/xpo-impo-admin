import { baseApi } from "@/redux/api/baseApi";

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "active"
  | "paused"
  | "expired";

export type CampaignType = "flash-sale" | "deal-of-day";

export type CampaignProductInput = {
  productId: string;
  discountType: "percentage" | "fixed-price";
  discountValue: number;
  salePrice: number;
  stockLimit: number;
  soldQuantity?: number;
};

export type Campaign = {
  _id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  products: CampaignProductInput[];
  startAt: string;
  endAt: string;
};

type CampaignPayload = Omit<Campaign, "_id" | "status" | "products"> & {
  status?: CampaignStatus;
  products: CampaignProductInput[];
};

const campaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query<Campaign[], Record<string, string> | void>({
      query: (params) => ({ url: "/campaign", method: "GET", params }),
      transformResponse: (response: { data: Campaign[] }) => response.data,
      providesTags: ["Campaigns"],
    }),
    createCampaign: builder.mutation<Campaign, CampaignPayload>({
      query: (body) => ({ url: "/campaign/create", method: "POST", body }),
      transformResponse: (response: { data: Campaign }) => response.data,
      invalidatesTags: ["Campaigns"],
    }),
    updateCampaignStatus: builder.mutation<
      Campaign,
      { id: string; status: CampaignStatus }
    >({
      query: ({ id, status }) => ({
        url: `/campaign/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Campaigns"],
    }),
    deleteCampaign: builder.mutation<void, string>({
      query: (id) => ({ url: `/campaign/${id}`, method: "DELETE" }),
      invalidatesTags: ["Campaigns"],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useUpdateCampaignStatusMutation,
  useDeleteCampaignMutation,
} = campaignApi;
