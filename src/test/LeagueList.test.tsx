import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LeagueList } from "../components/LeagueList";
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
    strLeagueAlternate: null,
  },
];

describe("LeagueList", () => {
  it("renders list of league cards", () => {
    render(
      <LeagueList
        leagues={mockLeagues}
        selectedLeagueId={null}
        onLeagueClick={() => {}}
      />
    );
    expect(screen.getByText("English Premier League")).toBeInTheDocument();
    expect(screen.getByText("NBA")).toBeInTheDocument();
  });

  it("shows empty state when no leagues", () => {
    render(
      <LeagueList
        leagues={[]}
        selectedLeagueId={null}
        onLeagueClick={() => {}}
      />
    );
    expect(
      screen.getByText("No leagues found matching your filters.")
    ).toBeInTheDocument();
  });

  it("marks the selected league card", () => {
    render(
      <LeagueList
        leagues={mockLeagues}
        selectedLeagueId="1"
        onLeagueClick={() => {}}
      />
    );
    const buttons = screen.getAllByRole("button");
    // First card should be selected
    expect(buttons[0]).toHaveClass("selected");
    // Second card should not
    expect(buttons[1]).not.toHaveClass("selected");
  });

  it("passes click handler to cards", async () => {
    const onClick = vi.fn();
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    render(
      <LeagueList
        leagues={mockLeagues}
        selectedLeagueId={null}
        onLeagueClick={onClick}
      />
    );

    await user.click(screen.getAllByRole("button")[1]);
    expect(onClick).toHaveBeenCalledWith("2");
  });
});
