const AUTH_STORAGE_KEY = "isAuthenticated";
const TOKEN_STORAGE_KEY = "jwt_token";

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export function markAuthenticated(): void {
  localStorage.setItem(AUTH_STORAGE_KEY, "true");
}

export function clearAuthenticated(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function storeToken(token: string): void {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}
