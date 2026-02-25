import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { League, Season } from "./types";
import { fetchAllLeagues, fetchSeasonBadge } from "./api";

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchAllLeagues(controller.signal)
      .then((data) => {
        setLeagues(data.leagues ?? []);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, []);

  return { leagues, loading, error };
}

export function useSportTypes(leagues: League[]) {
  return useMemo(() => {
    const sports = new Set(leagues.map((l) => l.strSport));
    return Array.from(sports).sort();
  }, [leagues]);
}

export function useFilteredLeagues(
  leagues: League[],
  searchQuery: string,
  selectedSport: string
) {
  return useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return leagues.filter((league) => {
      const matchesSearch =
        !query || league.strLeague.toLowerCase().includes(query);
      const matchesSport =
        !selectedSport || league.strSport === selectedSport;
      return matchesSearch && matchesSport;
    });
  }, [leagues, searchQuery, selectedSport]);
}

export function useSeasonBadge() {
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [season, setSeason] = useState<Season | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const selectLeague = useCallback((leagueId: string) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setSelectedLeagueId(leagueId);
    setLoading(true);
    setError(null);
    setSeason(null);

    fetchSeasonBadge(leagueId, controller.signal)
      .then((data) => {
        const firstSeason = data.seasons?.[0] ?? null;
        setSeason(firstSeason);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const clearSelection = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setSelectedLeagueId(null);
    setSeason(null);
    setError(null);
  }, []);

  return { selectedLeagueId, season, loading, error, selectLeague, clearSelection };
}
