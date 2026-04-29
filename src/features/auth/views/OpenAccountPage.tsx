import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { TrendingUp, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { validateRegisterForm } from "@/features/auth/utils/authValidators";
import type { FormErrors, RegisterFormData } from "@/features/auth/types/auth";

const TODAY = new Date().toISOString().split("T")[0];

const INITIAL_FORM: RegisterFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  username: "",
  dateOfBirth: "",
};

type FieldConfig = {
  id: keyof RegisterFormData;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
};

const TOP_FIELDS: FieldConfig[] = [
  { id: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "you@example.com" },
  { id: "username", label: "Username", type: "text", autoComplete: "username", placeholder: "e.g. johndoe" },
];

export function OpenAccountPage() {
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();

  const [form, setForm] = useState<RegisterFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors<RegisterFormData>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validateRegisterForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    register(form, {
      onSuccess: () => navigate("/dashboard", { replace: true }),
      onError: (error) => toast.error(error.message),
    });
  }

  function inputClass(field: keyof RegisterFormData) {
    return `w-full rounded-lg border bg-input-background px-4 py-3 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
        : "border-input focus:border-primary focus:ring-primary/20"
    }`;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-chart-2/10 p-4 py-10">
      <Link
        to="/"
        className="absolute left-6 top-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-8 block cursor-pointer text-center">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-2">
            <TrendingUp className="size-8 text-white" />
          </div>
          <h1 className="mb-1 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-2xl font-bold text-transparent">
            Lynx Broker
          </h1>
          <p className="text-sm text-muted-foreground">Your gateway to smart trading</p>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <h2 className="mb-1 text-xl font-semibold text-foreground">Create your account</h2>
          <p className="mb-6 text-sm text-muted-foreground">Start trading in minutes — it&apos;s free</p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {TOP_FIELDS.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="mb-1.5 block text-sm font-medium text-foreground">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  value={form[field.id]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={inputClass(field.id)}
                />
                {errors[field.id] && (
                  <p className="mt-1.5 text-xs text-destructive">{errors[field.id]}</p>
                )}
              </div>
            ))}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-foreground">
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className={inputClass("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-foreground">
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={inputClass("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1.5 text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="mb-1.5 block text-sm font-medium text-foreground">
                Date of birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                autoComplete="bday"
                value={form.dateOfBirth}
                onChange={handleChange}
                max={TODAY}
                className={inputClass("dateOfBirth")}
              />
              {errors.dateOfBirth && (
                <p className="mt-1.5 text-xs text-destructive">{errors.dateOfBirth}</p>
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
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`${inputClass("password")} pr-10`}
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
                <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-foreground">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`${inputClass("confirmPassword")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-destructive">{errors.confirmPassword}</p>
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
                  Creating account…
                </>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
