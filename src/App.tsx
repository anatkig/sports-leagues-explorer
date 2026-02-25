import { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { SportFilter } from "./components/SportFilter";
import { SportStats } from "./components/SportStats";
import { LeagueList } from "./components/LeagueList";
import { BadgePanel } from "./components/BadgePanel";
import {
  useLeagues,
  useSportTypes,
  useFilteredLeagues,
  useSeasonBadge,
} from "./hooks";
import "./App.css";

function App() {
  const { leagues, loading, error } = useLeagues();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("");

  const sportTypes = useSportTypes(leagues);
  const filteredLeagues = useFilteredLeagues(
    leagues,
    searchQuery,
    selectedSport
  );

  const badge = useSeasonBadge();

  const selectedLeague = leagues.find(
    (l) => l.idLeague === badge.selectedLeagueId
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sports Leagues</h1>
        <p className="subtitle">Browse and explore leagues worldwide</p>
      </header>

      <div className="toolbar">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <SportFilter
          sports={sportTypes}
          selected={selectedSport}
          onChange={setSelectedSport}
        />
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading leagues...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <p>Failed to load leagues: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <SportStats
            leagues={leagues}
            onSportClick={setSelectedSport}
            selectedSport={selectedSport}
          />
          <p className="results-count">
            Showing {filteredLeagues.length} of {leagues.length} leagues
          </p>
          <LeagueList
            leagues={filteredLeagues}
            selectedLeagueId={badge.selectedLeagueId}
            onLeagueClick={badge.selectLeague}
          />
        </>
      )}

      {badge.selectedLeagueId && (
        <BadgePanel
          season={badge.season}
          loading={badge.loading}
          error={badge.error}
          leagueName={selectedLeague?.strLeague ?? "League"}
          onClose={badge.clearSelection}
        />
      )}
    </div>
  );
}

export default App;
