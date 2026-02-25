import { useState, useEffect, useMemo, useCallback } from "react";
import type { League, Season } from "./types";
import { fetchAllLeagues, fetchSeasonBadge } from "./api";

export function useLeagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAllLeagues()
      .then((data) => {
        if (!cancelled) {
          setLeagues(data.leagues ?? []);
          setLoading(false);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
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

  const selectLeague = useCallback((leagueId: string) => {
    setSelectedLeagueId(leagueId);
    setLoading(true);
    setError(null);
    setSeason(null);

    fetchSeasonBadge(leagueId)
      .then((data) => {
        const firstSeason = data.seasons?.[0] ?? null;
        setSeason(firstSeason);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLeagueId(null);
    setSeason(null);
    setError(null);
  }, []);

  return { selectedLeagueId, season, loading, error, selectLeague, clearSelection };
}
