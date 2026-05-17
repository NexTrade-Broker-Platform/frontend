import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { botRepository, type BotPosition } from "../services/botRepository";

export type { BotPosition };

export function useBotStatus() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["bot", "status"],
    queryFn: () => botRepository.getStatus().then((r) => r.data),
    refetchInterval: 5_000,
    retry: false,
  });

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

  return {
    running: data?.status === "running" || data?.status === "starting",
    isLoading,
    startingSum: data?.starting_sum ?? 0,
    currentCash: data?.current_cash ?? 0,
    positions: data?.positions ?? {},
    start: (startingSum: number) => startMutation.mutate(startingSum),
    stop: () => stopMutation.mutate(),
    isMutating: startMutation.isPending || stopMutation.isPending,
  };
}
