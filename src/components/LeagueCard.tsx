import type { League } from "../types";

interface LeagueCardProps {
  league: League;
  isSelected: boolean;
  onClick: (leagueId: string) => void;
}

export function LeagueCard({ league, isSelected, onClick }: LeagueCardProps) {
  return (
    <div
      className={`league-card${isSelected ? " selected" : ""}`}
      onClick={() => onClick(league.idLeague)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(league.idLeague);
        }
      }}
      aria-label={`View badge for ${league.strLeague}`}
    >
      <h3 className="league-name">{league.strLeague}</h3>
      <div className="league-details">
        <span className="sport-tag">{league.strSport}</span>
        {league.strLeagueAlternate && (
          <span className="league-alt" title="Alternate name">
            {league.strLeagueAlternate}
          </span>
        )}
      </div>
    </div>
  );
}
