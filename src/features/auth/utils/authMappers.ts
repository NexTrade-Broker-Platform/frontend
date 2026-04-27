import type { AuthResponseDto, AuthResult, AuthUser, AuthUserDto } from "@/features/auth/types/auth";

function mapAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    username: dto.username,
    firstName: dto.first_name,
    lastName: dto.last_name,
    dateOfBirth: dto.date_of_birth,
    createdAt: dto.created_at,
    isActive: dto.is_active,
  };
}

export function mapAuthResponse(dto: AuthResponseDto): AuthResult {
  return {
    token: dto.token ?? "",
    user: dto.user ? mapAuthUser(dto.user) : null,
  };
}
