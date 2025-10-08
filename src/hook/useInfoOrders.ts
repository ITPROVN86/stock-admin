import { useQuery } from "@tanstack/react-query";
import { getAllInfoOrders, getAllInfoOrdersMatch, OrderListResponse, OrderMarketType, OrderSideType, OrderStatusType } from "../apis/orders.api";

export const useInfoOrders = (params?: { page?: number; limit?: number; side?: OrderSideType; type?: OrderMarketType; status?: OrderStatusType; search?: string }) => {
    return useQuery<OrderListResponse>({
        queryKey: ["orders", params?.page ?? 1, params?.limit ?? 10, params?.side, params?.type, params?.status, params?.search],
        queryFn: () => getAllInfoOrders(params),
      });
}

export const useInfoOrdersMatch = () => {
    return useQuery({
        queryKey: ["ordersMatch"],
        queryFn: getAllInfoOrdersMatch,
      });
}