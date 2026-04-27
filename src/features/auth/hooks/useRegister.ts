import { useMutation } from "@tanstack/react-query";
import { authManager } from "@/features/auth/services/authManager";
import type { RegisterFormData } from "@/features/auth/types/auth";

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterFormData) => authManager.register(data),
  });
}
