import { useEffect, useState } from "react";

type Props = {
  marketTime: string;
  speedMultiplier: number;
  fetchedAt: number;
};

export function MarketClock({ marketTime, speedMultiplier, fetchedAt }: Props) {
  const [current, setCurrent] = useState(() => advance(marketTime, speedMultiplier, fetchedAt));

  useEffect(() => {
    setCurrent(advance(marketTime, speedMultiplier, fetchedAt));
    const id = setInterval(
      () => setCurrent(advance(marketTime, speedMultiplier, fetchedAt)),
      1000,
    );
    return () => clearInterval(id);
  }, [marketTime, speedMultiplier, fetchedAt]);

  return (
    <span>
      <span className="mr-2">
        {current.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
      <span className="font-mono">
        {current.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </span>
    </span>
  );
}

function advance(marketTime: string, speedMultiplier: number, fetchedAt: number): Date {
  const base = new Date(marketTime).getTime();
  const elapsed = (Date.now() - fetchedAt) * speedMultiplier;
  return new Date(base + elapsed);
}
