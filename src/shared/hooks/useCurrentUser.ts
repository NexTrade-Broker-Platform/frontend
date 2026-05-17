import { useQuery } from "@tanstack/react-query";
import { api } from "@/shared/lib/api/httpClient";

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  const res = await api.get<Record<string, string>>("/users/me");
  const d = res.data;
  return {
    id: d.id ?? "",
    firstName: d.first_name ?? d.firstName ?? "",
    lastName: d.last_name ?? d.lastName ?? "",
    email: d.email ?? "",
    username: d.username ?? "",
  };
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
  });
}
