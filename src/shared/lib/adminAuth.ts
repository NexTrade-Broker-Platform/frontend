const KEY = "nextrade_admin_isAuthenticated";
const TOKEN_KEY = "nextrade_admin_token";

export function isAdminAuthenticated(): boolean {
  return localStorage.getItem(KEY) === "true";
}

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function markAdminAuthenticated(token?: string): void {
  localStorage.setItem(KEY, "true");
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAdminAuthenticated(): void {
  localStorage.removeItem(KEY);
  localStorage.removeItem(TOKEN_KEY);
}
