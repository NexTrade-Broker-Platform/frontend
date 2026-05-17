import { api } from "@/shared/lib/api/httpClient";
import type {
  OrdersQueryParams,
  OrdersResponseDto,
  PlaceOrderRequestDto,
  PlaceOrderResponseDto,
} from "@/features/orders/types/orders";

export const ordersRepository = {
  placeOrder(data: PlaceOrderRequestDto) {
    return api.post<PlaceOrderResponseDto>("/orders", data);
  },

  getOrders(params?: OrdersQueryParams) {
    return api.get<OrdersResponseDto>("/orders", { params });
  },

  getOrder(orderId: string) {
    return api.get<PlaceOrderResponseDto>(`/orders/${orderId}`);
  },

  cancelOrder(orderId: string) {
    return api.delete<PlaceOrderResponseDto>(`/orders/${orderId}`);
  },
};
