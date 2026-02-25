import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useLeagues, useSportTypes, useFilteredLeagues } from "../hooks";
import type { League } from "../types";
import * as api from "../api";

// Mock the api module
vi.mock("../api", () => ({
  fetchAllLeagues: vi.fn(),
  fetchSeasonBadge: vi.fn(),
}));

const mockFetchAllLeagues = vi.mocked(api.fetchAllLeagues);

// ---- Test data ----
const mockLeagues: League[] = [
  {
    idLeague: "1",
    strLeague: "English Premier League",
    strSport: "Soccer",
    strLeagueAlternate: "EPL",
  },
  {
    idLeague: "2",
    strLeague: "NBA",
    strSport: "Basketball",
    strLeagueAlternate: "National Basketball Association",
  },
  {
    idLeague: "3",
    strLeague: "La Liga",
    strSport: "Soccer",
    strLeagueAlternate: null,
  },
  {
    idLeague: "4",
    strLeague: "Formula 1",
    strSport: "Motorsport",
    strLeagueAlternate: "F1",
  },
];

// ---- useSportTypes ----
describe("useSportTypes", () => {
  it("returns sorted unique sport types", () => {
    const { result } = renderHook(() => useSportTypes(mockLeagues));
    expect(result.current).toEqual(["Basketball", "Motorsport", "Soccer"]);
  });

  it("returns empty array for no leagues", () => {
    const { result } = renderHook(() => useSportTypes([]));
    expect(result.current).toEqual([]);
  });
});

// ---- useFilteredLeagues ----
describe("useFilteredLeagues", () => {
  it("returns all leagues with no filters", () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(mockLeagues, "", "")
    );
    expect(result.current).toHaveLength(4);
  });

  it("filters by search query (case-insensitive)", () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(mockLeagues, "premier", "")
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].strLeague).toBe("English Premier League");
  });

  it("filters by sport type", () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(mockLeagues, "", "Soccer")
    );
    expect(result.current).toHaveLength(2);
    expect(result.current.every((l) => l.strSport === "Soccer")).toBe(true);
  });

  it("combines search and sport filters", () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(mockLeagues, "la", "Soccer")
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].strLeague).toBe("La Liga");
  });

  it("returns empty when nothing matches", () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(mockLeagues, "zzzzz", "")
    );
    expect(result.current).toHaveLength(0);
  });

  it("trims whitespace from search query", () => {
    const { result } = renderHook(() =>
      useFilteredLeagues(mockLeagues, "  nba  ", "")
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].strLeague).toBe("NBA");
  });
});

// ---- useLeagues (async, requires mocking api module) ----
describe("useLeagues", () => {
  beforeEach(() => {
    mockFetchAllLeagues.mockReset();
  });

  it("loads leagues from API", async () => {
    mockFetchAllLeagues.mockResolvedValue({ leagues: mockLeagues });

    const { result } = renderHook(() => useLeagues());

    // Initially loading
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.leagues).toHaveLength(4);
    expect(result.current.error).toBeNull();
  });

  it("handles API error", async () => {
    mockFetchAllLeagues.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useLeagues());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.leagues).toHaveLength(0);
  });
});
