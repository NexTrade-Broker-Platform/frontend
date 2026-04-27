import axios from "axios";
import { mapOrder, mapOrdersPage } from "@/features/orders/utils/ordersMappers";
import { ordersRepository } from "./ordersRepository";
import type {
  Order,
  OrdersPage,
  OrdersQueryParams,
  PlaceOrderFormData,
} from "@/features/orders/types/orders";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.error?.message;
    if (typeof msg === "string") return msg;
    if (error.response?.status === 402) return "Insufficient funds to place this order.";
    if (error.response?.status === 404) return "Order not found.";
  }
  return "Failed to process order. Please try again.";
}

export const ordersManager = {
  async placeOrder(data: PlaceOrderFormData): Promise<Order> {
    try {
      const response = await ordersRepository.placeOrder({
        instrument_type: data.instrumentType,
        instrument_id: data.instrumentId,
        order_type: data.orderType,
        side: data.side,
        quantity: data.quantity,
        limit_price: data.limitPrice,
      });
      return mapOrder(response.data.order);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getOrders(params?: OrdersQueryParams): Promise<OrdersPage> {
    try {
      const response = await ordersRepository.getOrders(params);
      return mapOrdersPage(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await ordersRepository.cancelOrder(orderId);
      return mapOrder(response.data.order);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
