import axios from "axios";
import { mapPortfolio } from "@/features/portfolio/utils/portfolioMappers";
import { portfolioRepository } from "./portfolioRepository";
import type { Portfolio } from "@/features/portfolio/types/portfolio";

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const msg = error.response?.data?.error?.message;
    if (typeof msg === "string") return msg;
  }
  return "Failed to load portfolio. Please try again.";
}

export const portfolioManager = {
  async getPortfolio(): Promise<Portfolio> {
    try {
      const response = await portfolioRepository.getPortfolio();
      return mapPortfolio(response.data);
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },
};
