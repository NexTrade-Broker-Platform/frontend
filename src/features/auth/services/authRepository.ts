import { api, publicApi } from "@/shared/lib/api/httpClient";
import type { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from "@/features/auth/types/auth";

export const authRepository = {
  login(data: LoginRequestDto) {
    return publicApi.post<AuthResponseDto>("/users/login", data);
  },

  register(data: RegisterRequestDto) {
    return publicApi.post<AuthResponseDto>("/users/register", data);
  },

  logout() {
    return api.post<{ message: string }>("/users/logout");
  },
};
