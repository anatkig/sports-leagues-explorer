import type { Season } from "../types";

interface BadgePanelProps {
  season: Season | null;
  loading: boolean;
  error: string | null;
  leagueName: string;
  onClose: () => void;
}

export function BadgePanel({
  season,
  loading,
  error,
  leagueName,
  onClose,
}: BadgePanelProps) {
  return (
    <div className="badge-overlay" onClick={onClose}>
      <div className="badge-panel" onClick={(e) => e.stopPropagation()}>
        <button className="badge-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <h2>{leagueName}</h2>

        {loading && <div className="badge-loading">Loading badge...</div>}

        {error && <div className="badge-error">Error: {error}</div>}

        {!loading && !error && season && (
          <div className="badge-content">
            <p className="season-label">Season: {season.strSeason}</p>
            {season.strBadge ? (
              <img
                className="badge-image"
                src={season.strBadge}
                alt={`${leagueName} - ${season.strSeason} badge`}
              />
            ) : (
              <p className="no-badge">No badge available for this season.</p>
            )}
          </div>
        )}

        {!loading && !error && !season && (
          <p className="no-badge">No season data available for this league.</p>
        )}
      </div>
    </div>
  );
}
