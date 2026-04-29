import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authManager } from "@/features/auth/services/authManager";
import type { LoginFormData } from "@/features/auth/types/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginFormData) => authManager.login(data),
    onSuccess: () => queryClient.clear(),
  });
}
