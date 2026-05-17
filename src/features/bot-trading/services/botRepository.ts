import { api } from "@/shared/lib/api/httpClient";

export interface BotPosition {
  quantity: number;
  avg_cost: number;
  total_cost: number;
}

export interface BotStatusResponse {
  user_id: string;
  status: "running" | "stopped" | "starting";
  message?: string;
  starting_sum?: number;
  current_cash?: number;
  positions?: Record<string, BotPosition>;
}

export const botRepository = {
  start: (startingSum: number) =>
    api.post<BotStatusResponse>("/bot/start", { starting_sum: startingSum }),
  stop: () => api.post<BotStatusResponse>("/bot/stop"),
  getStatus: () => api.get<BotStatusResponse>("/bot/status"),
};
