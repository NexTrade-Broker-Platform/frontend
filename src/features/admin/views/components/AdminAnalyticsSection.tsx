import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useAdminOrders } from "@/features/admin/hooks/useAdminOrders";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";

const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#6366f1"];

export function AdminAnalyticsSection() {
  const { data: orders } = useAdminOrders();
  const { data: users } = useAdminUsers();

  const statusData = useMemo(() => {
    if (!orders) return [];
    const counts = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const topTradersData = useMemo(() => {
    if (!orders || !users) return [];
    const userVolume = orders.reduce((acc, o) => {
      acc[o.platformUserId] = (acc[o.platformUserId] || 0) + (o.filledQuantity || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(userVolume)
      .map(([id, volume]) => {
        const user = users.find(u => u.id === id);
        return {
          name: user ? `${user.firstName} ${user.lastName.charAt(0)}.` : id.substring(0, 8),
          volume
        };
      })
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }, [orders, users]);

  const typeData = useMemo(() => {
    if (!orders) return [];
    const counts = orders.reduce((acc, o) => {
      acc[o.orderType] = (acc[o.orderType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  if (!orders || orders.length === 0) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Order Status */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">Platform Order Status</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)" }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Traders */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">Top Traders (Volume)</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topTradersData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--color-border)" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                width={100}
                tick={{ fontSize: 11, fill: "var(--color-foreground)" }} 
              />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)" }}
              />
              <Bar dataKey="volume" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Types */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-6 text-sm font-bold text-muted-foreground uppercase tracking-widest">Market vs Limit</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                label
                dataKey="value"
              >
                {typeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
