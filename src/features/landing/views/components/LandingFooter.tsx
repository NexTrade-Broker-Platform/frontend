import { APP_NAME } from "@/app/config";

export function LandingFooter() {
  return (
    <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
    </footer>
  );
}
