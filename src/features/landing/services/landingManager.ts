import { landingRepository } from "./landingRepository";
import { mapLandingStats, mapStockPreviews } from "../utils/landingMappers";

async function getLandingStats() {
  const dto = await landingRepository.getLandingStats();
  return mapLandingStats(dto);
}

async function getMarketPreview() {
  const dto = await landingRepository.getMarketPreview();
  return mapStockPreviews(dto);
}

export const landingManager = {
  getLandingStats,
  getMarketPreview,
};
