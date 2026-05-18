import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAdminStats } from "@/features/admin/hooks/useAdminStats";

interface ChartPoint {
  time: string;
  revenue: number;
  money: number;
}

export function AdminRealtimeChart() {
  const { data: stats } = useAdminStats();
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    if (stats) {
      const now = new Date();
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      setData((prev) => {
        const newData = [...prev, { time: timeStr, revenue: stats.totalRevenue, money: stats.totalMoney }];
        if (newData.length > 30) return newData.slice(1);
        return newData;
      });
    }
  }, [stats]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Platform Activity</h2>
          <p className="text-sm text-muted-foreground">Real-time revenue and liquidity monitoring</p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-success" />
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-primary" />
            <span>Liquidity</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorMoney" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              hide 
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
              itemStyle={{ fontSize: "12px" }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-success)"
              fillOpacity={1}
              fill="url(#colorRev)"
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="money"
              stroke="var(--color-primary)"
              fillOpacity={1}
              fill="url(#colorMoney)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
