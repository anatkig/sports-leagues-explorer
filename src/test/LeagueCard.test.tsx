import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LeagueCard } from "../components/LeagueCard";
import type { League } from "../types";

const league: League = {
  idLeague: "42",
  strLeague: "English Premier League",
  strSport: "Soccer",
  strLeagueAlternate: "EPL",
};

const leagueNoAlt: League = {
  idLeague: "43",
  strLeague: "La Liga",
  strSport: "Soccer",
  strLeagueAlternate: null,
};

describe("LeagueCard", () => {
  it("renders league name", () => {
    render(
      <LeagueCard league={league} isSelected={false} onClick={() => {}} />
    );
    expect(screen.getByText("English Premier League")).toBeInTheDocument();
  });

  it("renders sport tag", () => {
    render(
      <LeagueCard league={league} isSelected={false} onClick={() => {}} />
    );
    expect(screen.getByText("Soccer")).toBeInTheDocument();
  });

  it("renders alternate name when present", () => {
    render(
      <LeagueCard league={league} isSelected={false} onClick={() => {}} />
    );
    expect(screen.getByText("EPL")).toBeInTheDocument();
  });

  it("does not render alternate name when null", () => {
    render(
      <LeagueCard league={leagueNoAlt} isSelected={false} onClick={() => {}} />
    );
    expect(screen.queryByTitle("Alternate name")).not.toBeInTheDocument();
  });

  it("calls onClick with league ID on click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<LeagueCard league={league} isSelected={false} onClick={onClick} />);

    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledWith("42");
  });

  it("calls onClick on Enter keypress", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<LeagueCard league={league} isSelected={false} onClick={onClick} />);

    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledWith("42");
  });

  it("calls onClick on Space keypress", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<LeagueCard league={league} isSelected={false} onClick={onClick} />);

    screen.getByRole("button").focus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledWith("42");
  });

  it("applies selected class when isSelected is true", () => {
    render(
      <LeagueCard league={league} isSelected={true} onClick={() => {}} />
    );
    expect(screen.getByRole("button")).toHaveClass("selected");
  });

  it("does not apply selected class when isSelected is false", () => {
    render(
      <LeagueCard league={league} isSelected={false} onClick={() => {}} />
    );
    expect(screen.getByRole("button")).not.toHaveClass("selected");
  });
});
