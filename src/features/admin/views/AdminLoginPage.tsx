import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { authManager } from "@/features/auth/services/authManager";
import { markAdminAuthenticated } from "@/shared/lib/adminAuth";
import { APP_NAME } from "@/app/config";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    try {
      const result = await authManager.login({ email, password });

      if (!result.user?.isAdmin) {
        setError("Access denied. This account does not have admin privileges.");
        return;
      }

      markAdminAuthenticated();
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-destructive/5 via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center animate-hero-in">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10">
            <ShieldCheck className="size-7 text-destructive" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-destructive">
              Admin Portal
            </p>
            <p className="text-sm text-muted-foreground">{APP_NAME} platform management</p>
          </div>
        </div>

        <div
          className="rounded-2xl border border-border bg-card p-6 shadow-lg animate-hero-in sm:p-8"
          style={{ animationDelay: "100ms" }}
        >
          <h2 className="mb-1 text-xl font-semibold">Administrator Sign In</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Restricted access — authorised personnel only
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full rounded-xl border border-input bg-input-background px-4 py-3 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full rounded-xl border border-input bg-input-background px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground shadow-lg shadow-destructive/20 transition-all hover:bg-destructive/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Verifying…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
