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
    userId: dto.userId,
    currency: dto.currency,
    availableBalance: dto.availableBalance,
    reservedBalance: dto.reservedBalance,
    updatedAt: dto.updatedAt,
    createdAt: dto.createdAt,
    isActive: dto.active,
  };
}

function mapWalletTransaction(dto: WalletTransactionDto): WalletTransaction {
  return {
    id: dto.id,
    walletId: dto.walletId,
    referenceId: dto.referenceId,
    type: dto.transactionType,
    amount: dto.amount,
    createdAt: dto.createdAt,
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
