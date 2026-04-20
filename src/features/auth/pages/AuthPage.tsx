import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { TrendingUp } from "lucide-react";
import { markAuthenticated } from "../../../shared/lib/auth";

export function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    markAuthenticated();
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-chart-2/10 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-2">
            <TrendingUp className="size-8 text-white" />
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            TradeFlow
          </h1>
          <p className="text-muted-foreground">Your Gateway to Smart Trading</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
          <h2 className="mb-6">Welcome Back</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-input-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm text-foreground"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-input bg-input-background px-4 py-3 text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-primary to-chart-2 px-4 py-3 text-white transition-opacity hover:opacity-90"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Demo credentials: Any email and password will work
          </div>
        </div>
      </div>
    </div>
  );
}
