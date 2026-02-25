import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SportFilter } from "../components/SportFilter";

const sports = ["Basketball", "Motorsport", "Soccer"];

describe("SportFilter", () => {
  it("renders default 'All Sports' option", () => {
    render(<SportFilter sports={sports} selected="" onChange={() => {}} />);
    expect(
      screen.getByRole("option", { name: "All Sports" })
    ).toBeInTheDocument();
  });

  it("renders all sport options", () => {
    render(<SportFilter sports={sports} selected="" onChange={() => {}} />);
    sports.forEach((sport) => {
      expect(screen.getByRole("option", { name: sport })).toBeInTheDocument();
    });
  });

  it("shows the selected value", () => {
    render(
      <SportFilter sports={sports} selected="Soccer" onChange={() => {}} />
    );
    expect(screen.getByLabelText("Filter by sport type")).toHaveValue("Soccer");
  });

  it("calls onChange when selection changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SportFilter sports={sports} selected="" onChange={onChange} />);

    await user.selectOptions(
      screen.getByLabelText("Filter by sport type"),
      "Basketball"
    );
    expect(onChange).toHaveBeenCalledWith("Basketball");
  });

  it("has accessible label", () => {
    render(<SportFilter sports={sports} selected="" onChange={() => {}} />);
    expect(screen.getByLabelText("Filter by sport type")).toBeInTheDocument();
  });
});
