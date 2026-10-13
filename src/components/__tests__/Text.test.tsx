// src/components/__tests__/Text.test.tsx
import { render, screen } from "@testing-library/react-native";
import Text from "../Text";

describe("Text", () => {
  it("renders its children", async () => {
    await render(<Text>Hello</Text>);
    expect(screen.getByText("Hello")).toBeOnTheScreen();
  });

  it("renders with a variant", async () => {
    await render(<Text variant="heading">Title</Text>);
    expect(screen.getByText("Title")).toBeOnTheScreen();
  });
});
