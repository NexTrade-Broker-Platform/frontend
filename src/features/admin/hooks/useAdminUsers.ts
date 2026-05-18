import { useQuery } from "@tanstack/react-query";
import { adminManager } from "@/features/admin/services/adminManager";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminManager.getUsers(),
    refetchInterval: 60_000,
  });
}
