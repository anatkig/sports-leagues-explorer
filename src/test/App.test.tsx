import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { League } from "../types";

const mockLeagues: League[] = [
  {
    idLeague: "1",
    strLeague: "English Premier League",
    strSport: "Soccer",
    strLeagueAlternate: "EPL",
  },
  {
    idLeague: "2",
    strLeague: "NBA",
    strSport: "Basketball",
    strLeagueAlternate: "National Basketball Association",
  },
  {
    idLeague: "3",
    strLeague: "La Liga",
    strSport: "Soccer",
    strLeagueAlternate: null,
  },
];

const mockFetchAllLeagues = vi.fn();
const mockFetchSeasonBadge = vi.fn();

vi.mock("../api", () => ({
  fetchAllLeagues: (...args: unknown[]) => mockFetchAllLeagues(...args),
  fetchSeasonBadge: (...args: unknown[]) => mockFetchSeasonBadge(...args),
}));

// Dynamic import so the mock is in place
let App: React.ComponentType;

beforeEach(async () => {
  mockFetchAllLeagues.mockReset();
  mockFetchSeasonBadge.mockReset();
  mockFetchAllLeagues.mockResolvedValue({ leagues: mockLeagues });

  const mod = await import("../App");
  App = mod.default;
});

describe("App", () => {
  it("shows loading state initially then renders leagues", async () => {
    render(<App />);

    expect(screen.getByText("Loading leagues...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("English Premier League")).toBeInTheDocument();
    });

    expect(screen.getByText("NBA")).toBeInTheDocument();
    expect(screen.getByText("La Liga")).toBeInTheDocument();
    expect(screen.getByText(/Showing 3 of 3 leagues/)).toBeInTheDocument();
  });

  it("filters leagues by search input", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("English Premier League")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Search leagues..."),
      "premier"
    );

    expect(screen.getByText("English Premier League")).toBeInTheDocument();
    expect(screen.queryByText("NBA")).not.toBeInTheDocument();
    expect(screen.queryByText("La Liga")).not.toBeInTheDocument();
    expect(screen.getByText(/Showing 1 of 3 leagues/)).toBeInTheDocument();
  });

  it("filters leagues by sport dropdown", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("English Premier League")).toBeInTheDocument();
    });

    await user.selectOptions(
      screen.getByLabelText("Filter by sport type"),
      "Basketball"
    );

    expect(screen.getByText("NBA")).toBeInTheDocument();
    expect(screen.queryByText("English Premier League")).not.toBeInTheDocument();
    expect(screen.getByText(/Showing 1 of 3 leagues/)).toBeInTheDocument();
  });

  it("shows empty state when no matches", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("English Premier League")).toBeInTheDocument();
    });

    await user.type(
      screen.getByPlaceholderText("Search leagues..."),
      "xyznonexistent"
    );

    expect(
      screen.getByText("No leagues found matching your filters.")
    ).toBeInTheDocument();
  });

  it("opens badge panel when clicking a league", async () => {
    const user = userEvent.setup();
    mockFetchSeasonBadge.mockResolvedValue({
      seasons: [
        {
          strSeason: "2023-2024",
          strBadge: "https://example.com/epl-badge.png",
          strDescriptionEN: null,
        },
      ],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("English Premier League")).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(screen.getByText("Season: 2023-2024")).toBeInTheDocument();
    });

    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/epl-badge.png"
    );
  });

  it("closes badge panel on close button click", async () => {
    const user = userEvent.setup();
    mockFetchSeasonBadge.mockResolvedValue({
      seasons: [
        {
          strSeason: "2023-2024",
          strBadge: "https://example.com/badge.png",
          strDescriptionEN: null,
        },
      ],
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("English Premier League")).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole("button")[0]);

    await waitFor(() => {
      expect(screen.getByText("Season: 2023-2024")).toBeInTheDocument();
    });

    await user.click(screen.getByLabelText("Close"));

    expect(screen.queryByText("Season: 2023-2024")).not.toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    mockFetchAllLeagues.mockRejectedValue(new Error("Server error"));

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByText("Failed to load leagues: Server error")
      ).toBeInTheDocument();
    });
  });
});
