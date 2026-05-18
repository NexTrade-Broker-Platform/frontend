import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { FadeIn } from "@/shared/components/FadeIn";
import { Loader2, User as UserIcon, Bot, Wallet, Calendar, Mail } from "lucide-react";
import { Link } from "react-router";

export function UserListPage() {
  const { data: users, isLoading, isError, error } = useAdminUsers();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Error loading users: {(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-destructive">
              Admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">User Management</h1>
            <p className="mt-2 text-muted-foreground">Manage and monitor all platform users</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground font-medium">Total Users</p>
            <p className="text-3xl font-bold text-foreground">{users?.length ?? 0}</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold text-center">Bot Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Wallet Balance</th>
                  <th className="px-6 py-4 font-semibold">Joined</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users?.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <UserIcon className="size-5" />
                        </div>
                        <div>
                          <Link
                            to={`/admin/users/${user.id}`}
                            className="font-semibold text-foreground hover:text-primary hover:underline"
                          >
                            {user.firstName} {user.lastName}
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="size-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {user.isBotRunning ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                          <Bot className="size-3" />
                          Running
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          <Bot className="size-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 font-mono font-bold text-foreground">
                        <Wallet className="size-3 text-muted-foreground" />
                        ${user.walletBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="size-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          to={`/admin/users/${user.id}`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Manage
                        </Link>
                        <span className="text-muted-foreground/30">|</span>
                        <Link
                          to={`/admin/users/${user.id}/orders`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Orders
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
