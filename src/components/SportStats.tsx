import { useMemo } from "react";
import type { League } from "../types";

export interface SportStat {
  sport: string;
  count: number;
  percentage: number;
}

interface SportStatsProps {
  leagues: League[];
  onSportClick?: (sport: string) => void;
  selectedSport?: string;
}

export function SportStats({ leagues, onSportClick, selectedSport }: SportStatsProps) {
  const stats = useMemo(() => {
    const counts = new Map<string, number>();
    for (const league of leagues) {
      counts.set(league.strSport, (counts.get(league.strSport) ?? 0) + 1);
    }

    const total = leagues.length;
    const result: SportStat[] = Array.from(counts.entries())
      .map(([sport, count]) => ({
        sport,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return result;
  }, [leagues]);

  if (stats.length === 0) return null;

  const topStats = stats.slice(0, 8);
  const othersCount = stats.slice(8).reduce((sum, s) => sum + s.count, 0);
  const total = leagues.length;

  return (
    <div className="sport-stats" role="region" aria-label="Sport statistics">
      <h2 className="sport-stats-title">
        Leagues by Sport
        <span className="sport-stats-total">{total} total</span>
      </h2>
      <div className="sport-stats-bars">
        {topStats.map((stat) => (
          <button
            key={stat.sport}
            className={`sport-stat-row${selectedSport === stat.sport ? " active" : ""}`}
            onClick={() => onSportClick?.(selectedSport === stat.sport ? "" : stat.sport)}
            title={`${stat.sport}: ${stat.count} leagues (${stat.percentage.toFixed(1)}%)`}
          >
            <span className="sport-stat-label">{stat.sport}</span>
            <div className="sport-stat-track">
              <div
                className="sport-stat-fill"
                style={{ width: `${stat.percentage}%` }}
              />
            </div>
            <span className="sport-stat-count">{stat.count}</span>
          </button>
        ))}
        {othersCount > 0 && (
          <div className="sport-stat-row others">
            <span className="sport-stat-label">Others</span>
            <div className="sport-stat-track">
              <div
                className="sport-stat-fill"
                style={{ width: `${(othersCount / total) * 100}%` }}
              />
            </div>
            <span className="sport-stat-count">{othersCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
