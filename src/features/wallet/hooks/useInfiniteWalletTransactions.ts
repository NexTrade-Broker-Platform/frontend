import { useInfiniteQuery } from "@tanstack/react-query";
import { walletManager } from "@/features/wallet/services/walletManager";

const PAGE_SIZE = 10;

export function useInfiniteWalletTransactions() {
  return useInfiniteQuery({
    queryKey: ["wallet", "transactions", "infinite"],
    queryFn: ({ pageParam }) => walletManager.getTransactions(pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage + 1 < totalPages ? currentPage + 1 : undefined;
    },
  });
}
