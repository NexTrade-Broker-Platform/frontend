export type WalletTransactionType = "DEPOSIT" | "WITHDRAWAL" | "ORDER_HOLD" | "ORDER_RELEASE";

export interface WalletDto {
  id: string;
  user_id: string;
  currency: string;
  available_balance: number;
  reserved_balance: number;
  is_active: boolean;
}

export interface WalletTransactionDto {
  id: string;
  wallet_id: string;
  reference_id: string;
  transaction_type: WalletTransactionType;
  amount: number;
  created_at: string;
}

export interface DepositRequestDto {
  amount: number;
  currency: string;
}

export interface DepositResponseDto {
  message: string;
  wallet: WalletDto;
  transaction: WalletTransactionDto;
}

export interface Wallet {
  id: string;
  currency: string;
  availableBalance: number;
  reservedBalance: number;
  isActive: boolean;
}

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amount: number;
  createdAt: string;
}

export interface DepositResult {
  message: string;
  wallet: Wallet;
  transaction: WalletTransaction;
}

export interface DepositFormData {
  amount: number;
  currency: string;
}
