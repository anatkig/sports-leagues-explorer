import type { League } from "../types";
import { LeagueCard } from "./LeagueCard";

interface LeagueListProps {
  leagues: League[];
  selectedLeagueId: string | null;
  onLeagueClick: (leagueId: string) => void;
}

export function LeagueList({
  leagues,
  selectedLeagueId,
  onLeagueClick,
}: LeagueListProps) {
  if (leagues.length === 0) {
    return (
      <div className="empty-state">
        <p>No leagues found matching your filters.</p>
      </div>
    );
  }

  return (
    <div className="league-list">
      {leagues.map((league) => (
        <LeagueCard
          key={league.idLeague}
          league={league}
          isSelected={league.idLeague === selectedLeagueId}
          onClick={onLeagueClick}
        />
      ))}
    </div>
  );
}
