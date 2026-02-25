import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "../components/SearchBar";

describe("SearchBar", () => {
  it("renders with placeholder text", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(
      screen.getByPlaceholderText("Search leagues...")
    ).toBeInTheDocument();
  });

  it("displays the current value", () => {
    render(<SearchBar value="Premier" onChange={() => {}} />);
    expect(screen.getByDisplayValue("Premier")).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText("Search leagues...");
    await user.type(input, "a");
    expect(onChange).toHaveBeenCalledWith("a");
  });

  it("shows clear button when value is present", () => {
    render(<SearchBar value="test" onChange={() => {}} />);
    expect(screen.getByLabelText("Clear search")).toBeInTheDocument();
  });

  it("does not show clear button when value is empty", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.queryByLabelText("Clear search")).not.toBeInTheDocument();
  });

  it("calls onChange with empty string on clear", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchBar value="test" onChange={onChange} />);

    await user.click(screen.getByLabelText("Clear search"));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("has accessible label", () => {
    render(<SearchBar value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Search leagues by name")).toBeInTheDocument();
  });
});
