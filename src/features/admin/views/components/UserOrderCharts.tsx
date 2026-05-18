import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import type { AdminOrder } from "../../types/admin";

interface UserOrderChartsProps {
  orders: AdminOrder[];
}

const COLORS = ["#10b981", "#ef4444", "#3b82f6", "#f59e0b", "#8b5cf6", "#6366f1"];

export function UserOrderCharts({ orders }: UserOrderChartsProps) {
  // Side distribution (BUY vs SELL)
  const sideData = [
    { name: "Buy", value: orders.filter(o => o.side === "BUY").length },
    { name: "Sell", value: orders.filter(o => o.side === "SELL").length },
  ].filter(d => d.value > 0);

  // Status breakdown
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  // Volume by instrument (top 5)
  const instrumentVolume = orders.reduce((acc, o) => {
    acc[o.instrumentId] = (acc[o.instrumentId] || 0) + (o.filledQuantity || 0);
    return acc;
  }, {} as Record<string, number>);
  const volumeData = Object.entries(instrumentVolume)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Side Distribution */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Side Distribution</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sideData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sideData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Order Status</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {statusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume by Instrument */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="mb-4 text-sm font-bold text-muted-foreground uppercase tracking-wider">Top Instruments (Fill Qty)</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: "transparent" }}
                contentStyle={{ backgroundColor: "var(--color-card)", borderRadius: "8px", border: "1px solid var(--color-border)" }}
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
