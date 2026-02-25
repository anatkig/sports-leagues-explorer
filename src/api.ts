import type { AllLeaguesResponse, SeasonsResponse } from "./types";

const BASE_URL = "https://www.thesportsdb.com/api/v1/json/3";

const badgeCache = new Map<string, SeasonsResponse>();

export async function fetchAllLeagues(): Promise<AllLeaguesResponse> {
  const response = await fetch(`${BASE_URL}/all_leagues.php`);
  if (!response.ok) {
    throw new Error(`Failed to fetch leagues: ${response.status}`);
  }
  return response.json() as Promise<AllLeaguesResponse>;
}

export async function fetchSeasonBadge(
  leagueId: string
): Promise<SeasonsResponse> {
  const cached = badgeCache.get(leagueId);
  if (cached) {
    return cached;
  }

  const response = await fetch(
    `${BASE_URL}/search_all_seasons.php?badge=1&id=${leagueId}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch badge: ${response.status}`);
  }
  const data = (await response.json()) as SeasonsResponse;
  badgeCache.set(leagueId, data);
  return data;
}
