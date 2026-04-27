import type {
  DepositResponseDto,
  DepositResult,
  Wallet,
  WalletDto,
  WalletTransaction,
  WalletTransactionDto,
} from "@/features/wallet/types/wallet";

function mapWallet(dto: WalletDto): Wallet {
  return {
    id: dto.id,
    currency: dto.currency,
    availableBalance: dto.available_balance,
    reservedBalance: dto.reserved_balance,
    isActive: dto.is_active,
  };
}

function mapWalletTransaction(dto: WalletTransactionDto): WalletTransaction {
  return {
    id: dto.id,
    type: dto.transaction_type,
    amount: dto.amount,
    createdAt: dto.created_at,
  };
}

export function mapDepositResponse(dto: DepositResponseDto): DepositResult {
  return {
    message: dto.message,
    wallet: mapWallet(dto.wallet),
    transaction: mapWalletTransaction(dto.transaction),
  };
}
