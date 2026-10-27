import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Logo } from "@/components/core";

describe("Logo", () => {
  it("renders the title logo", async () => {
    await render(<Logo />);
    expect(screen.getByText("Resume Builder")).toBeOnTheScreen();
  });

  it("renders the subtitle logo", async () => {
    await render(<Logo />);
    expect(screen.getByText("Build your career story")).toBeOnTheScreen();
  });

  it("renders image logo on the screen", async () => {
    await render(<Logo />);
    expect(screen.getByTestId("logo-image")).toBeOnTheScreen();
  });
});
