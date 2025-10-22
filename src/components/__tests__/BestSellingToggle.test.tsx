import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import { BestSellingToggle } from "../BestSellingToggle";

describe("BestSellingToggle", () => {
  it("sets the correct ARIA attributes", () => {
    const handleChange = vi.fn();
    render(<BestSellingToggle checked onChange={handleChange} id="toggle-1" />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).not.toHaveAttribute("aria-disabled");

    fireEvent.click(toggle);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("respects disabled and loading states", () => {
    const handleChange = vi.fn();
    render(<BestSellingToggle checked={false} onChange={handleChange} disabled loading />);

    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveAttribute("aria-disabled", "true");
    expect(toggle).toHaveAttribute("aria-busy", "true");

    fireEvent.click(toggle);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("toggles via keyboard using Space and Enter", () => {
    const handleChange = vi.fn();
    render(<BestSellingToggle checked={false} onChange={handleChange} />);

    const toggle = screen.getByRole("switch");

    fireEvent.keyDown(toggle, { key: " " });
    expect(handleChange).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(toggle, { key: "Enter" });
    expect(handleChange).toHaveBeenCalledTimes(2);
  });
});
