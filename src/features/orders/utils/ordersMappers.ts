import type { Order, OrderDto, OrdersPage, OrdersResponseDto } from "@/features/orders/types/orders";

export function mapOrder(dto: OrderDto): Order {
  return {
    orderId: dto.order_id,
    instrumentType: dto.instrument_type,
    instrumentId: dto.instrument_id,
    orderType: dto.order_type,
    side: dto.side,
    quantity: dto.quantity,
    limitPrice: dto.limit_price,
    status: dto.status,
    filledQuantity: dto.filled_quantity,
    averageFillPrice: dto.average_fill_price,
    exchangeFee: dto.exchange_fee,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
    expiresAt: dto.expires_at,
  };
}

export function mapOrdersPage(dto: OrdersResponseDto): OrdersPage {
  return {
    orders: (dto.orders ?? []).map(mapOrder),
    pagination: dto.pagination,
  };
}
