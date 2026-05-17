import { useOptions } from "@/features/markets/hooks/useOptions";

export function useOption(optionId: string | undefined) {
  const query = useOptions({ enabled: !!optionId });
  return {
    ...query,
    data: query.data?.find((o) => o.optionId === optionId),
  };
}
