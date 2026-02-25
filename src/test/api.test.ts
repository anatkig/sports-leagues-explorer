import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchAllLeagues, fetchSeasonBadge } from "../api";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
});

describe("fetchAllLeagues", () => {
  it("returns leagues on success", async () => {
    const mockData = {
      leagues: [
        {
          idLeague: "1",
          strLeague: "English Premier League",
          strSport: "Soccer",
          strLeagueAlternate: "EPL",
        },
      ],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchAllLeagues();

    expect(mockFetch).toHaveBeenCalledWith(
      "https://www.thesportsdb.com/api/v1/json/3/all_leagues.php",
      { signal: undefined }
    );
    expect(result).toEqual(mockData);
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(fetchAllLeagues()).rejects.toThrow(
      "Failed to fetch leagues: 500"
    );
  });
});

describe("fetchSeasonBadge", () => {
  it("returns season data on success", async () => {
    const mockData = {
      seasons: [
        {
          strSeason: "2023-2024",
          strBadge: "https://example.com/badge.png",
          strDescriptionEN: "A league",
        },
      ],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchSeasonBadge("4328");

    expect(mockFetch).toHaveBeenCalledWith(
      "https://www.thesportsdb.com/api/v1/json/3/search_all_seasons.php?badge=1&id=4328",
      { signal: undefined }
    );
    expect(result).toEqual(mockData);
  });

  it("returns cached result on second call", async () => {
    const mockData = {
      seasons: [
        {
          strSeason: "2023-2024",
          strBadge: "https://example.com/badge.png",
          strDescriptionEN: null,
        },
      ],
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    // First call — hits network
    const result1 = await fetchSeasonBadge("9999");
    expect(mockFetch).toHaveBeenCalledTimes(1);

    // Second call — should use cache
    const result2 = await fetchSeasonBadge("9999");
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result2).toEqual(result1);
  });

  it("throws on non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(fetchSeasonBadge("0000")).rejects.toThrow(
      "Failed to fetch badge: 404"
    );
  });
});
