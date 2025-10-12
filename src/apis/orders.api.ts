import api from "./axiosCustom";
import { appUrls } from "./contants";

export type OrderMarketType = "limit" | "market";

export type OrderSideType = "buy" | "sell";

export type OrderStatusType =
  | "pending"
  | "partially_filled"
  | "completed"
  | "cancelled";

export interface OrderInfo {
  id: string;
  uid: string;
  email: string;
  ticker: string;
  type: OrderMarketType;
  price: number;
  side: OrderSideType;
  status: OrderStatusType;
  totalAmount: number;
  filledAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderMatch {
  id: string;
  uid: string;
  orderBuyId: string;
  orderSellId: string;
  incomingOrderId: string;
  amount: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export type MatchDateRange = "day" | "week" | "month" | "year" | "all";

export interface OrderMatchListResponse {
  items: OrderMatch[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrderListResponse {
  items: OrderInfo[];
  pagination: Pagination;
}

export const getAllInfoOrders = async (
  params?: {
    page?: number;
    limit?: number;
    side?: OrderSideType;
    type?: OrderMarketType;
    status?: OrderStatusType;
    search?: string;
  }
): Promise<OrderListResponse> => {
  const queryParams: Record<string, string | number> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
  };

  if (params?.side) queryParams.side = params.side;
  if (params?.type) queryParams.type = params.type;
  if (params?.status) queryParams.status = params.status;
  if (params?.search) queryParams.search = params.search;

  const response = await api.get(`${appUrls.tradeURL}/admin/all-order`, {
    params: queryParams,
  });
  return {
    items: response.data?.data?.items ?? [],
    pagination: response.data?.data?.pagination ?? {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
};

export const getAllInfoOrdersMatch = async (
  params?: { page?: number; limit?: number; searchUid?: string; dateRange?: MatchDateRange }
): Promise<OrderMatchListResponse> => {
  const queryParams: Record<string, string | number> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
  };

  if (params?.searchUid) queryParams.searchUid = params.searchUid;
  if (params?.dateRange) queryParams.dateRange = params.dateRange;

  const response = await api.get(`${appUrls.tradeURL}/admin/match-histories`, {
    params: queryParams,
  });

  return {
    items: response.data?.data?.items ?? [],
    pagination: response.data?.data?.pagination ?? {
      page: params?.page ?? 1,
      limit: params?.limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
};
