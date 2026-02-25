import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BadgePanel } from "../components/BadgePanel";
import type { Season } from "../types";

const season: Season = {
  strSeason: "2023-2024",
  strBadge: "https://example.com/badge.png",
  strDescriptionEN: "Some description",
};

describe("BadgePanel", () => {
  it("renders league name", () => {
    render(
      <BadgePanel
        season={season}
        loading={false}
        error={null}
        leagueName="English Premier League"
        onClose={() => {}}
      />
    );
    expect(screen.getByText("English Premier League")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(
      <BadgePanel
        season={null}
        loading={true}
        error={null}
        leagueName="EPL"
        onClose={() => {}}
      />
    );
    expect(screen.getByText("Loading badge...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    render(
      <BadgePanel
        season={null}
        loading={false}
        error="Network failure"
        leagueName="EPL"
        onClose={() => {}}
      />
    );
    expect(screen.getByText("Error: Network failure")).toBeInTheDocument();
  });

  it("shows badge image with season info", () => {
    render(
      <BadgePanel
        season={season}
        loading={false}
        error={null}
        leagueName="EPL"
        onClose={() => {}}
      />
    );
    expect(screen.getByText("Season: 2023-2024")).toBeInTheDocument();
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "https://example.com/badge.png");
    expect(img).toHaveAttribute("alt", "EPL - 2023-2024 badge");
  });

  it("shows no-badge message when strBadge is null", () => {
    const noBadgeSeason: Season = {
      strSeason: "2022-2023",
      strBadge: null,
      strDescriptionEN: null,
    };
    render(
      <BadgePanel
        season={noBadgeSeason}
        loading={false}
        error={null}
        leagueName="EPL"
        onClose={() => {}}
      />
    );
    expect(
      screen.getByText("No badge available for this season.")
    ).toBeInTheDocument();
  });

  it("shows message when season is null", () => {
    render(
      <BadgePanel
        season={null}
        loading={false}
        error={null}
        leagueName="EPL"
        onClose={() => {}}
      />
    );
    expect(
      screen.getByText("No season data available for this league.")
    ).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BadgePanel
        season={season}
        loading={false}
        error={null}
        leagueName="EPL"
        onClose={onClose}
      />
    );

    await user.click(screen.getByLabelText("Close"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when overlay is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BadgePanel
        season={season}
        loading={false}
        error={null}
        leagueName="EPL"
        onClose={onClose}
      />
    );

    // Click the overlay (parent element with class badge-overlay)
    const overlay = document.querySelector(".badge-overlay")!;
    await user.click(overlay);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onClose when panel content is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <BadgePanel
        season={season}
        loading={false}
        error={null}
        leagueName="EPL"
        onClose={onClose}
      />
    );

    // Click the panel itself (stopPropagation should prevent onClose)
    await user.click(screen.getByText("EPL"));
    expect(onClose).not.toHaveBeenCalled();
  });
});
