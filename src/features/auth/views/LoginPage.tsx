import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { validateLoginForm } from "@/features/auth/utils/authValidators";
import type { FormErrors, LoginFormData } from "@/features/auth/types/auth";
import { APP_NAME } from "@/app/config";
import logo from "@/assets/logo.svg";

const INITIAL_FORM: LoginFormData = { email: "", password: "" };

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const [form, setForm] = useState<LoginFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors<LoginFormData>>({});
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    const validationErrors = validateLoginForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    login(form, {
      onSuccess: () => navigate("/dashboard", { replace: true }),
      onError: (error) => toast.error(error.message),
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-chart-2/10 p-4">
      <Link
        to="/"
        className="absolute left-6 top-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 block cursor-pointer text-center animate-hero-in"
        >
          <img src={logo} alt={APP_NAME} className="mx-auto mb-4 size-16" />
          <h1 className="mb-1 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-2xl font-bold text-transparent">
            {APP_NAME}
          </h1>
          <p className="text-sm text-muted-foreground">Your gateway to smart trading</p>
        </Link>

        <div
          className="rounded-2xl border border-border bg-card p-6 shadow-lg animate-hero-in sm:p-8"
          style={{ animationDelay: "150ms" }}
        >
          <h2 className="mb-1 text-xl font-semibold text-foreground">Welcome back</h2>
          <p className="mb-6 text-sm text-muted-foreground">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full rounded-lg border bg-input-background px-4 py-3 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                    : "border-input focus:border-primary focus:ring-primary/20"
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 wrap-break-word text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`w-full rounded-lg border bg-input-background px-4 py-3 pr-10 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                      : "border-input focus:border-primary focus:ring-primary/20"
                  }`}
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
              {errors.password && (
                <p className="mt-1.5 wrap-break-word text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-chart-2 px-4 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Open one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
