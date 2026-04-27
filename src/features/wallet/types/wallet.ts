export type DepositRequestDto = {
  amount: number;
  currency: string;
};

export type WithdrawRequestDto = {
  amount: number;
  currency: string;
};

export type WalletDto = {
  id: string;
  user_id: string;
  currency: string;
  available_balance: number;
  reserved_balance: number;
  updated_at: string;
  created_at: string;
  is_active: boolean;
};

export type WalletTransactionDto = {
  id: string;
  wallet_id: string;
  reference_id: string | null;
  transaction_type: "DEPOSIT" | "WITHDRAWAL" | "ORDER_HOLD" | "ORDER_RELEASE";
  amount: number;
  created_at: string;
};

export type DepositResponseDto = {
  message: string;
  wallet: WalletDto;
  transaction: WalletTransactionDto;
};

export type WalletBalanceResponseDto = {
  wallet: WalletDto;
};

export type PaginationDto = {
  total_records: number;
  current_page: number;
  total_pages: number;
  limit: number;
};

export type WalletTransactionsPageResponseDto = {
  transactions: WalletTransactionDto[];
  pagination: PaginationDto;
};

export type DepositFormData = {
  amount: number;
  currency: string;
};

export type WithdrawFormData = {
  amount: number;
  currency: string;
};

export type Wallet = {
  id: string;
  userId: string;
  currency: string;
  availableBalance: number;
  reservedBalance: number;
  updatedAt: string;
  createdAt: string;
  isActive: boolean;
};

export type WalletTransaction = {
  id: string;
  walletId: string;
  referenceId: string | null;
  type: "DEPOSIT" | "WITHDRAWAL" | "ORDER_HOLD" | "ORDER_RELEASE";
  amount: number;
  createdAt: string;
};

export type Pagination = {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  limit: number;
};

export type DepositResult = {
  message: string;
  wallet: Wallet;
  transaction: WalletTransaction;
};

export type WalletBalance = {
  wallet: Wallet;
};

export type WalletTransactionsPage = {
  transactions: WalletTransaction[];
  pagination: Pagination;
};
