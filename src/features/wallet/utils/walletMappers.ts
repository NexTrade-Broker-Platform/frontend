import type {
  DepositResponseDto,
  DepositResult,
  Pagination,
  PaginationDto,
  Wallet,
  WalletBalance,
  WalletBalanceResponseDto,
  WalletDto,
  WalletTransaction,
  WalletTransactionDto,
  WalletTransactionsPage,
  WalletTransactionsPageResponseDto,
} from "@/features/wallet/types/wallet";

function mapWallet(dto: WalletDto): Wallet {
  return {
    id: dto.id,
    userId: dto.user_id,
    currency: dto.currency,
    availableBalance: dto.available_balance,
    reservedBalance: dto.reserved_balance,
    updatedAt: dto.updated_at,
    createdAt: dto.created_at,
    isActive: dto.is_active,
  };
}

function mapWalletTransaction(dto: WalletTransactionDto): WalletTransaction {
  return {
    id: dto.id,
    walletId: dto.wallet_id,
    referenceId: dto.reference_id,
    type: dto.transaction_type,
    amount: dto.amount,
    createdAt: dto.created_at,
  };
}

function mapPagination(dto: PaginationDto): Pagination {
  return {
    totalRecords: dto.total_records,
    currentPage: dto.current_page,
    totalPages: dto.total_pages,
    limit: dto.limit,
  };
}

export function mapDepositResponse(dto: DepositResponseDto): DepositResult {
  return {
    message: dto.message,
    wallet: mapWallet(dto.wallet),
    transaction: mapWalletTransaction(dto.transaction),
  };
}

export function mapWalletBalanceResponse(
  dto: WalletBalanceResponseDto,
): WalletBalance {
  return {
    wallet: mapWallet(dto.wallet),
  };
}

export function mapWalletTransactionsPageResponse(
  dto: WalletTransactionsPageResponseDto,
): WalletTransactionsPage {
  return {
    transactions: dto.transactions.map(mapWalletTransaction),
    pagination: mapPagination(dto.pagination),
  };
}
