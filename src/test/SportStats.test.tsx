import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SportStats } from "../components/SportStats";
import type { League } from "../types";

const mockLeagues: League[] = [
  { idLeague: "1", strLeague: "EPL", strSport: "Soccer", strLeagueAlternate: null },
  { idLeague: "2", strLeague: "La Liga", strSport: "Soccer", strLeagueAlternate: null },
  { idLeague: "3", strLeague: "NBA", strSport: "Basketball", strLeagueAlternate: null },
  { idLeague: "4", strLeague: "F1", strSport: "Motorsport", strLeagueAlternate: null },
  { idLeague: "5", strLeague: "Ligue 1", strSport: "Soccer", strLeagueAlternate: null },
];

describe("SportStats", () => {
  it("renders sport names and counts", () => {
    render(<SportStats leagues={mockLeagues} />);
    expect(screen.getByText("Soccer")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Basketball")).toBeInTheDocument();
    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Motorsport")).toBeInTheDocument();
  });

  it("shows total count", () => {
    render(<SportStats leagues={mockLeagues} />);
    expect(screen.getByText("5 total")).toBeInTheDocument();
  });

  it("sorts by count descending", () => {
    render(<SportStats leagues={mockLeagues} />);
    const labels = screen.getAllByText(/Soccer|Basketball|Motorsport/);
    expect(labels[0].textContent).toBe("Soccer");
  });

  it("renders nothing when no leagues", () => {
    const { container } = render(<SportStats leagues={[]} />);
    expect(container.innerHTML).toBe("");
  });

  it("calls onSportClick when a sport row is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SportStats leagues={mockLeagues} onSportClick={onClick} />);

    await user.click(screen.getByText("Basketball"));
    expect(onClick).toHaveBeenCalledWith("Basketball");
  });

  it("deselects when clicking the already selected sport", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SportStats
        leagues={mockLeagues}
        onSportClick={onClick}
        selectedSport="Soccer"
      />
    );

    await user.click(screen.getByText("Soccer"));
    expect(onClick).toHaveBeenCalledWith("");
  });

  it("highlights the selected sport row", () => {
    render(
      <SportStats
        leagues={mockLeagues}
        selectedSport="Soccer"
      />
    );
    const soccerRow = screen.getByTitle(/Soccer: 3 leagues/);
    expect(soccerRow).toHaveClass("active");
  });

  it("has accessible region label", () => {
    render(<SportStats leagues={mockLeagues} />);
    expect(screen.getByRole("region", { name: "Sport statistics" })).toBeInTheDocument();
  });

  it("shows 'Others' row when more than 8 sports", () => {
    const manyLeagues: League[] = [];
    for (let i = 0; i < 10; i++) {
      manyLeagues.push({
        idLeague: String(i),
        strLeague: `League ${i}`,
        strSport: `Sport${i}`,
        strLeagueAlternate: null,
      });
    }
    render(<SportStats leagues={manyLeagues} />);
    expect(screen.getByText("Others")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // 10 - 8 = 2 in Others
  });
});
