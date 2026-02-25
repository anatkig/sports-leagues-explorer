export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate: string | null;
}

export interface Season {
  strSeason: string;
  strBadge: string | null;
  strDescriptionEN: string | null;
}

export interface AllLeaguesResponse {
  leagues: League[];
}

export interface SeasonsResponse {
  seasons: Season[] | null;
}
