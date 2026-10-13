// src/components/__tests__/Text.test.tsx
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import Text from "../Text";

describe("Text", () => {
  it("renders its children", async () => {
    await render(<Text>Hello</Text>);
    // @ts-ignore – toBeOnTheScreen is provided by @testing-library/react-native at runtime
    expect(screen.getByText("Hello")).toBeOnTheScreen();
  });

  it("renders with a variant", async () => {
    await render(<Text variant="heading">Title</Text>);
    // @ts-ignore – toBeOnTheScreen is provided by @testing-library/react-native at runtime
    expect(screen.getByText("Title")).toBeOnTheScreen();
  });
});
