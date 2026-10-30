import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { Animated, Text } from "react-native";
import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";

import { Button } from "@/components/core";

// Render the gradient as a View with a testID so we can read the colors it gets.
jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: (props: Record<string, unknown>) =>
      React.createElement(View, { ...props, testID: "gradient" }),
  };
});

const DEFAULT_COLORS = ["#4A6CF7", "#8B8FFF"];
const PRESSED_COLORS = ["#3B5BDB", "#7074E8"];
const INACTIVE_COLORS = ["#C7D2FE", "#C7D2FE"];

const getButton = () => screen.getByRole("button");
const getGradientColors = () => screen.getByTestId("gradient").props.colors;

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Button", () => {
  describe("content", () => {
    it("wraps a string child in text", async () => {
      await render(<Button>Save resume</Button>);

      expect(screen.getByText("Save resume")).toBeOnTheScreen();
    });

    it("renders a custom child as-is", async () => {
      await render(
        <Button>
          <Text>Custom content</Text>
        </Button>,
      );

      expect(screen.getByText("Custom content")).toBeOnTheScreen();
    });

    it("is exposed to screen readers as a button with its label", async () => {
      await render(<Button>Save resume</Button>);

      expect(screen.getByRole("button", { name: "Save resume" })).toBeOnTheScreen();
    });
  });

  describe("pressing", () => {
    it("calls onPress when the user presses it", async () => {
      const user = userEvent.setup();
      const onPress = jest.fn();
      await render(<Button onPress={onPress}>Save</Button>);

      await user.press(getButton());

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("forwards onPressIn and onPressOut", async () => {
      const user = userEvent.setup();
      const onPressIn = jest.fn();
      const onPressOut = jest.fn();
      await render(
        <Button onPressIn={onPressIn} onPressOut={onPressOut}>
          Save
        </Button>,
      );

      await user.press(getButton());

      expect(onPressIn).toHaveBeenCalledTimes(1);
      expect(onPressOut).toHaveBeenCalledTimes(1);
    });

    it("scales down on press in and back up on press out", async () => {
      const spring = jest.spyOn(Animated, "spring");
      await render(<Button>Save</Button>);

      await fireEvent(getButton(), "pressIn");
      expect(spring).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ toValue: 0.95 }),
      );

      await fireEvent(getButton(), "pressOut");
      expect(spring).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ toValue: 1 }),
      );
    });
  });

  describe("disabled", () => {
    it("is marked disabled", async () => {
      await render(<Button disabled>Save</Button>);

      expect(getButton()).toBeDisabled();
    });

    it("does not call onPress", async () => {
      const user = userEvent.setup();
      const onPress = jest.fn();
      await render(
        <Button disabled onPress={onPress}>
          Save
        </Button>,
      );

      await user.press(getButton());

      expect(onPress).not.toHaveBeenCalled();
    });
  });

  describe("loading", () => {
    it("hides the label and marks the button busy", async () => {
      await render(<Button isLoading>Save</Button>);

      expect(screen.queryByText("Save")).not.toBeOnTheScreen();
      expect(getButton()).toBeBusy();
    });

    it("is disabled and does not call onPress", async () => {
      const user = userEvent.setup();
      const onPress = jest.fn();
      await render(
        <Button isLoading onPress={onPress}>
          Save
        </Button>,
      );

      await user.press(getButton());

      expect(getButton()).toBeDisabled();
      expect(onPress).not.toHaveBeenCalled();
    });

    it("is not busy when not loading", async () => {
      await render(<Button>Save</Button>);

      expect(getButton()).not.toBeBusy();
    });
  });

  describe("gradient", () => {
    it("uses the default gradient", async () => {
      await render(<Button>Save</Button>);

      expect(getGradientColors()).toEqual(DEFAULT_COLORS);
    });

    it("switches to the pressed gradient while held down", async () => {
      await render(<Button>Save</Button>);

      await fireEvent(getButton(), "pressIn");
      expect(getGradientColors()).toEqual(PRESSED_COLORS);

      await fireEvent(getButton(), "pressOut");
      expect(getGradientColors()).toEqual(DEFAULT_COLORS);
    });

    it("uses the inactive gradient when disabled", async () => {
      await render(<Button disabled>Save</Button>);

      expect(getGradientColors()).toEqual(INACTIVE_COLORS);
    });

    it("uses the inactive gradient when loading", async () => {
      await render(<Button isLoading>Save</Button>);

      expect(getGradientColors()).toEqual(INACTIVE_COLORS);
    });

    it("uses custom gradientColors when provided, even when disabled", async () => {
      await render(
        <Button disabled gradientColors={["#000000", "#FFFFFF"]}>
          Save
        </Button>,
      );

      expect(getGradientColors()).toEqual(["#000000", "#FFFFFF"]);
    });
  });

  describe("solid background", () => {
    it("skips the gradient when className sets a bg- color", async () => {
      await render(<Button className="bg-red-500">Delete</Button>);

      expect(screen.queryByTestId("gradient")).not.toBeOnTheScreen();
      expect(screen.getByText("Delete")).toBeOnTheScreen();
    });

    it("still uses the gradient when gradientColors is given alongside a bg- class", async () => {
      await render(
        <Button className="bg-red-500" gradientColors={["#000000", "#FFFFFF"]}>
          Delete
        </Button>,
      );

      expect(getGradientColors()).toEqual(["#000000", "#FFFFFF"]);
    });
  });
});
