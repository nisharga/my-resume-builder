// src/components/ScreenHeader/ScreenHeader.test.tsx
import { describe, expect, it, jest } from "@jest/globals";
import { Pressable, Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";
import { ScreenHeader } from "@/components/common";

describe("ScreenHeader", () => {
  it("renders the title", async () => {
    await render(<ScreenHeader title="My Resume" />);

    expect(screen.getByText("My Resume")).toBeOnTheScreen();
  });

  it("renders the left slot content", async () => {
    await render(<ScreenHeader title="My Resume" left={<Text>Back</Text>} />);

    expect(screen.getByText("Back")).toBeOnTheScreen();
  });

  it("renders the right slot content", async () => {
    await render(<ScreenHeader title="My Resume" right={<Text>Save</Text>} />);

    expect(screen.getByText("Save")).toBeOnTheScreen();
  });

  it("renders only the title when no slots are given", async () => {
    await render(<ScreenHeader title="My Resume" />);

    expect(screen.getByText("My Resume")).toBeOnTheScreen();
    expect(screen.queryByRole("button")).not.toBeOnTheScreen();
  });

  it("renders both slots together", async () => {
    await render(
      <ScreenHeader title="Edit Resume" left={<Text>Back</Text>} right={<Text>Save</Text>} />,
    );

    expect(screen.getByText("Back")).toBeOnTheScreen();
    expect(screen.getByText("Edit Resume")).toBeOnTheScreen();
    expect(screen.getByText("Save")).toBeOnTheScreen();
  });

  it("lets the user press a button passed into the left slot", async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();

    await render(
      <ScreenHeader
        title="Edit Resume"
        left={
          <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={onBack}>
            <Text>Back</Text>
          </Pressable>
        }
      />,
    );

    await user.press(screen.getByRole("button", { name: "Go back" }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("lets the user press a button passed into the right slot", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    await render(
      <ScreenHeader
        title="Edit Resume"
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Save resume" onPress={onSave}>
            <Text>Save</Text>
          </Pressable>
        }
      />,
    );

    await user.press(screen.getByRole("button", { name: "Save resume" }));

    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
