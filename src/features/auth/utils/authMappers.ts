import type { AuthResponseDto, AuthResult, AuthUser, AuthUserDto } from "@/features/auth/types/auth";

function mapAuthUser(dto: AuthUserDto): AuthUser {
  return {
    id: dto.id,
    email: dto.email,
    username: dto.username,
    firstName: dto.firstName ?? dto.first_name ?? "",
    lastName: dto.lastName ?? dto.last_name ?? "",
    dateOfBirth: dto.dateOfBirth ?? dto.date_of_birth ?? "",
    createdAt: dto.createdAt ?? dto.created_at ?? "",
    isActive: dto.active ?? dto.is_active ?? false,
    isAdmin: dto.isAdmin ?? dto.is_admin ?? false,
  };
}

export function mapAuthResponse(dto: AuthResponseDto): AuthResult {
  return {
    user: dto.user ? mapAuthUser(dto.user) : null,
  };
}
