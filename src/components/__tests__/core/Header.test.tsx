import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Text } from "react-native";
import { render, screen, userEvent } from "@testing-library/react-native";

import { Header } from "@/components/core";

const mockBack = jest.fn();
const mockCanGoBack = jest.fn(() => true);

jest.mock("expo-router", () => ({
  useRouter: () => ({
    back: mockBack,
    canGoBack: mockCanGoBack,
  }),
}));

// Render the icon as a View with a testID so we can find and press the back button.
jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ChevronLeft: (props: Record<string, unknown>) =>
      React.createElement(View, { ...props, testID: "back-icon" }),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockCanGoBack.mockReturnValue(true);
});

describe("Header", () => {
  describe("title", () => {
    it("renders the title", async () => {
      await render(<Header title="My Resume" />);

      expect(screen.getByText("My Resume")).toBeOnTheScreen();
    });

    it("keeps the title to a single line", async () => {
      await render(<Header title="A very long resume title that should not wrap" />);

      expect(
        screen.getByText("A very long resume title that should not wrap").props.numberOfLines,
      ).toBe(1);
    });

    it("renders no text when no title is given", async () => {
      await render(<Header />);

      expect(screen.queryByText(/.+/)).not.toBeOnTheScreen();
    });
  });

  describe("back button", () => {
    it("is shown when the router can go back", async () => {
      await render(<Header title="My Resume" />);

      expect(screen.getByTestId("back-icon")).toBeOnTheScreen();
    });

    it("is hidden when the router cannot go back", async () => {
      mockCanGoBack.mockReturnValue(false);

      await render(<Header title="My Resume" />);

      expect(screen.queryByTestId("back-icon")).not.toBeOnTheScreen();
    });

    it("goes back with the router by default", async () => {
      const user = userEvent.setup();
      await render(<Header title="My Resume" />);

      await user.press(screen.getByTestId("back-icon"));

      expect(mockBack).toHaveBeenCalledTimes(1);
    });

    it("calls onBack instead of the router when provided", async () => {
      const user = userEvent.setup();
      const onBack = jest.fn();
      await render(<Header title="My Resume" onBack={onBack} />);

      await user.press(screen.getByTestId("back-icon"));

      expect(onBack).toHaveBeenCalledTimes(1);
      expect(mockBack).not.toHaveBeenCalled();
    });
  });

  describe("right action", () => {
    it("renders the right element", async () => {
      await render(<Header title="My Resume" right={<Text>Save</Text>} />);

      expect(screen.getByText("Save")).toBeOnTheScreen();
    });

    it("renders only the title and back button when no right element is given", async () => {
      await render(<Header title="My Resume" />);

      expect(screen.getByText("My Resume")).toBeOnTheScreen();
      expect(screen.queryByText("Save")).not.toBeOnTheScreen();
    });

    it("lets the user press the right element", async () => {
      const user = userEvent.setup();
      const onRightPress = jest.fn();
      await render(
        <Header title="Edit Resume" right={<Text>Save</Text>} onRightPress={onRightPress} />,
      );

      await user.press(screen.getByText("Save"));

      expect(onRightPress).toHaveBeenCalledTimes(1);
    });

    it("is disabled when no onRightPress is given", async () => {
      await render(<Header title="My Resume" right={<Text>Save</Text>} />);

      expect(screen.getByText("Save")).toBeDisabled();
    });

    it("is enabled when onRightPress is given", async () => {
      await render(<Header title="My Resume" right={<Text>Save</Text>} onRightPress={jest.fn()} />);

      expect(screen.getByText("Save")).toBeEnabled();
    });
  });

  describe("sticky", () => {
    it("renders normally when sticky is set (only Screen reads it)", async () => {
      await render(<Header title="My Resume" sticky />);

      expect(screen.getByText("My Resume")).toBeOnTheScreen();
      expect(screen.getByTestId("back-icon")).toBeOnTheScreen();
    });
  });
});
