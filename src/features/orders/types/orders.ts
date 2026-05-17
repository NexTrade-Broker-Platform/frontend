export type OrderType = "LIMIT" | "MARKET";
export type OrderSide = "BUY" | "SELL";
export type OrderStatus =
  | "PENDING"
  | "PARTIALLY_FILLED"
  | "FILLED"
  | "REJECTED"
  | "CANCELLED"
  | "EXPIRED";
export type InstrumentType = "STOCK" | "OPTION" | "ETF" | "CRYPTO";

export interface OrderDto {
  order_id: string;
  platform_id: string;
  platform_user_id: string;
  instrument_type: InstrumentType;
  instrument_id: string;
  order_type: OrderType;
  side: OrderSide;
  quantity: number;
  limit_price?: number;
  status: OrderStatus;
  filled_quantity: number;
  average_fill_price?: number;
  exchange_fee?: number;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface PlaceOrderRequestDto {
  instrument_type: InstrumentType;
  instrument_id: string;
  order_type: OrderType;
  side: OrderSide;
  quantity: number;
  limit_price?: number;
}

export interface PlaceOrderResponseDto {
  message: string;
  order: OrderDto;
}

export interface OrdersQueryParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
}

export interface OrdersResponseDto {
  orders: OrderDto[];
  pagination: PaginationDto;
}

export interface Order {
  orderId: string;
  instrumentType: InstrumentType;
  instrumentId: string;
  orderType: OrderType;
  side: OrderSide;
  quantity: number;
  limitPrice?: number;
  status: OrderStatus;
  filledQuantity: number;
  averageFillPrice?: number;
  exchangeFee?: number;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export interface PlaceOrderFormData {
  instrumentType: InstrumentType;
  instrumentId: string;
  orderType: OrderType;
  side: OrderSide;
  quantity: number;
  limitPrice?: number;
}

export interface OrdersPage {
  orders: Order[];
  pagination: PaginationDto;
}
