# Sports Leagues Explorer

A single-page application that consumes the [TheSportsDB](https://www.thesportsdb.com/free_sports_api) API to display, search, and filter sports leagues — with season badge lookup on click.

## Features

- **League listing** — Fetches and displays all leagues showing name, sport type, and alternate name
- **Search** — Filter leagues by name (case-insensitive)
- **Sport filter** — Dropdown to filter by sport type (Soccer, Basketball, Motorsport, etc.)
- **Season badge** — Click any league card to view its season badge image in a modal
- **Caching** — Badge API responses are cached in memory to avoid repeat network calls
- **Responsive** — Adapts from multi-column grid to single column on mobile
- **Accessible** — Keyboard navigation (Enter/Space) and ARIA labels throughout

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — Build tool and dev server
- **Vitest** + **React Testing Library** — Unit & integration tests
- No external UI libraries — plain CSS with custom properties

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
npm run preview
```

### Test

```bash
npm test            # single run
npm run test:watch  # watch mode
```

## Project Structure

```
src/
├── components/
│   ├── BadgePanel.tsx      # Modal overlay for season badge
│   ├── LeagueCard.tsx      # Individual league card
│   ├── LeagueList.tsx      # Grid of league cards
│   ├── SearchBar.tsx       # Search input with clear button
│   └── SportFilter.tsx     # Sport type dropdown
├── test/
│   ├── setup.ts            # Test setup (jsdom + jest-dom)
│   ├── api.test.ts         # API service tests
│   ├── hooks.test.ts       # Custom hooks tests
│   ├── App.test.tsx        # App integration tests
│   ├── SearchBar.test.tsx
│   ├── SportFilter.test.tsx
│   ├── LeagueCard.test.tsx
│   ├── LeagueList.test.tsx
│   └── BadgePanel.test.tsx
├── api.ts                  # API service with caching
├── hooks.ts                # Custom React hooks
├── types.ts                # TypeScript interfaces
├── App.tsx                 # Root component
├── App.css                 # Application styles
├── index.css               # Global reset & CSS variables
└── main.tsx                # Entry point
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /all_leagues.php` | Fetch all leagues |
| `GET /search_all_seasons.php?badge=1&id=<id>` | Fetch season badges for a league |

Base URL: `https://www.thesportsdb.com/api/v1/json/3`
