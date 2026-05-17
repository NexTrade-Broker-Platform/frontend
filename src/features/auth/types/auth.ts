export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  username: string;
  date_of_birth: string;
}

export interface AuthUserDto {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  dateOfBirth?: string;
  date_of_birth?: string;
  createdAt?: string;
  created_at?: string;
  active?: boolean;
  is_active?: boolean;
  isAdmin?: boolean;
  is_admin?: boolean;
}

export interface AuthResponseDto {
  message?: string;
  user?: AuthUserDto;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  createdAt: string;
  isActive: boolean;
  isAdmin: boolean;
}

export interface AuthResult {
  user: AuthUser | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;
