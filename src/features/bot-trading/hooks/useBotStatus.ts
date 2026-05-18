import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { botRepository, type BotPosition } from "../services/botRepository";

export type { BotPosition };

const STATS_CACHE_KEY = "bot_stats_cache_v1";

type CachedStats = { startingSum: number; currentCash: number };

function readCachedStats(): CachedStats {
  try {
    const raw = localStorage.getItem(STATS_CACHE_KEY);
    if (raw) return JSON.parse(raw) as CachedStats;
  } catch {}
  return { startingSum: 0, currentCash: 0 };
}

export function useBotStatus() {
  const queryClient = useQueryClient();
  const cachedRef = useRef<CachedStats>(readCachedStats());

  const { data, isLoading } = useQuery({
    queryKey: ["bot", "status"],
    queryFn: () => botRepository.getStatus().then((r) => r.data),
    refetchInterval: 5_000,
    retry: false,
  });

  // Persist the last valid stats so they survive bot stops
  useEffect(() => {
    if (data?.starting_sum != null && data.starting_sum > 0) {
      const updated = { startingSum: data.starting_sum, currentCash: data.current_cash ?? 0 };
      cachedRef.current = updated;
      localStorage.setItem(STATS_CACHE_KEY, JSON.stringify(updated));
    }
  }, [data?.starting_sum, data?.current_cash]);

  const startMutation = useMutation({
    mutationFn: (startingSum: number) =>
      botRepository.start(startingSum).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bot"] }),
  });

  const stopMutation = useMutation({
    mutationFn: () => botRepository.stop().then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bot"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const startingSum = data?.starting_sum ?? cachedRef.current.startingSum;
  const currentCash = data?.current_cash ?? cachedRef.current.currentCash;

  return {
    running: data?.status === "running" || data?.status === "starting",
    isLoading,
    startingSum,
    currentCash,
    positions: data?.positions ?? {},
    start: (startingSum: number) => startMutation.mutate(startingSum),
    stop: () => stopMutation.mutate(),
    isMutating: startMutation.isPending || stopMutation.isPending,
  };
}
