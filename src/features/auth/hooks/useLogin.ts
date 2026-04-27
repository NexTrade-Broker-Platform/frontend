import { useMutation } from "@tanstack/react-query";
import { authManager } from "@/features/auth/services/authManager";
import type { LoginFormData } from "@/features/auth/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginFormData) => authManager.login(data),
  });
}
