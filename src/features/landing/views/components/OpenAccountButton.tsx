import { useNavigate } from "react-router";

type OpenAccountButtonProps = {
  label?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses: Record<NonNullable<OpenAccountButtonProps["size"]>, string> = {
  sm: "px-4 py-2",
  md: "px-5 py-3",
  lg: "px-6 py-3",
};

export function OpenAccountButton({ label = "Open Account", size = "md" }: OpenAccountButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      className={`rounded-xl bg-primary ${sizeClasses[size]} text-sm font-semibold text-primary-foreground transition hover:bg-primary/90`}
      onClick={() => navigate("/signup")}
    >
      {label}
    </button>
  );
}
