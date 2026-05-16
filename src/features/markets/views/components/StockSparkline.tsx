import { memo } from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

export type SparklinePoint = { value: number };

type StockSparklineProps = {
  data: SparklinePoint[];
  isProfit: boolean;
};

export const StockSparkline = memo(function StockSparkline({ data, isProfit }: StockSparklineProps) {
  if (data.length < 2) {
    return <div className="h-8 w-20 rounded bg-muted/40" />;
  }

  const color = isProfit ? "var(--color-success)" : "var(--color-destructive)";

  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={data} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <YAxis domain={["dataMin", "dataMax"]} hide />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});
