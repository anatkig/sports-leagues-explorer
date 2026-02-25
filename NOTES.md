# AI Tools & Design Decisions

## AI Tools Used

- **GitHub Copilot (Claude) in VS Code** — Used as the primary coding assistant for the entire project. It helped with:
  - **Project scaffolding** — Generating the Vite + React + TypeScript boilerplate
  - **Component architecture** — Designing the component hierarchy and props interfaces
  - **API integration** — Writing the fetch service with in-memory caching
  - **Custom hooks** — Separating business logic (filtering, data fetching) from UI
  - **CSS styling** — Responsive layout, card design, modal overlay
  - **Unit tests** — Full test suite with Vitest + React Testing Library (67 tests)
  - **Bonus feature** — Sport statistics bar chart with interactive filtering

## Design Decisions

### Architecture
- **React + TypeScript + Vite** — Fast dev experience, strong type safety, minimal config.
- **Component-based structure** — `SearchBar`, `SportFilter`, `LeagueCard`, `LeagueList`, `BadgePanel`, and `SportStats` are isolated, reusable components with typed props.
- **Custom hooks** (`useLeagues`, `useSportTypes`, `useFilteredLeagues`, `useSeasonBadge`) keep data-fetching and business logic separate from rendering.
- **No external UI library** — Plain CSS with custom properties to keep the bundle lean.

### API & Caching
- API calls live in a dedicated `api.ts` service module.
- Season badge responses are cached in an in-memory `Map` keyed by league ID, preventing redundant network requests on repeated clicks.

### Filtering
- Search runs a case-insensitive substring match on `strLeague`.
- The sport dropdown is dynamically populated from the fetched data (sorted alphabetically).
- Both filters compose together — they apply simultaneously.

### UI / UX
- Responsive CSS grid layout (multi-column on desktop, single column on mobile).
- League cards are keyboard-accessible (`tabIndex`, `Enter`/`Space` handlers).
- Clicking a league opens a modal overlay showing the first season's badge image.
- Loading spinner and error states are handled gracefully.

### Testing
- 67 unit/integration tests across 9 test files covering API service, hooks, all components (including SportStats), and the full App.
- Mocks use `vi.mock` for the API module to keep tests isolated and fast.

### Extra Feature: Sport Statistics
- An interactive bar chart (`SportStats`) shows league counts grouped by sport.
- Displays the top 8 sports with an "Others" aggregation for the rest.
- Click any bar to filter the league list by that sport; click again to deselect.
- Fully responsive with animated fill bars.

### What I'd add with more time
- Pagination or virtual scrolling for the large league list.
- Debounced search input for performance on slower devices.
- Dark mode toggle.
- E2E tests with Playwright.
