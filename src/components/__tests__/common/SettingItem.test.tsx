import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Text } from "react-native";
import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";
import { SettingItem } from "@/components/common";

// Render the chevron as a View with a testID so we can check whether it's shown.
jest.mock("lucide-react-native", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    ChevronDown: (props: Record<string, unknown>) =>
      React.createElement(View, { ...props, testID: "chevron" }),
  };
});

const baseProps = {
  icon: <Text>icon</Text>,
  title: "Notifications",
  subtitle: "Manage your alerts",
};

const pressRow = async () => {
  const user = userEvent.setup();
  await user.press(screen.getByText(baseProps.title));
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("SettingItem", () => {
  describe("content", () => {
    it("renders the icon, title and subtitle", async () => {
      await render(<SettingItem {...baseProps} />);

      expect(screen.getByText("icon")).toBeOnTheScreen();
      expect(screen.getByText("Notifications")).toBeOnTheScreen();
      expect(screen.getByText("Manage your alerts")).toBeOnTheScreen();
    });
  });

  describe("chevron (default)", () => {
    it("shows a chevron and no switch", async () => {
      await render(<SettingItem {...baseProps} />);

      expect(screen.getByTestId("chevron")).toBeOnTheScreen();
      expect(screen.queryByRole("switch")).not.toBeOnTheScreen();
    });

    it("calls onPress when the row is pressed", async () => {
      const onPress = jest.fn();
      await render(<SettingItem {...baseProps} onPress={onPress} />);

      await pressRow();

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does nothing when pressed with no onPress or expanded content", async () => {
      await render(<SettingItem {...baseProps} />);

      await pressRow();

      expect(screen.getByText("Notifications")).toBeOnTheScreen();
    });
  });

  describe("expandable content", () => {
    const expandedContent = <Text>Extra settings</Text>;

    it("is hidden until the row is pressed", async () => {
      await render(<SettingItem {...baseProps} expandedContent={expandedContent} />);

      expect(screen.queryByText("Extra settings")).not.toBeOnTheScreen();
    });

    it("opens on press and closes on a second press", async () => {
      await render(<SettingItem {...baseProps} expandedContent={expandedContent} />);

      await pressRow();
      expect(screen.getByText("Extra settings")).toBeOnTheScreen();

      await pressRow();
      expect(screen.queryByText("Extra settings")).not.toBeOnTheScreen();
    });

    it("calls onPress instead of expanding when onPress is given", async () => {
      const onPress = jest.fn();
      await render(
        <SettingItem {...baseProps} expandedContent={expandedContent} onPress={onPress} />,
      );

      await pressRow();

      expect(onPress).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("Extra settings")).not.toBeOnTheScreen();
    });

    it("never expands when right is a toggle", async () => {
      await render(<SettingItem {...baseProps} right="toggle" expandedContent={expandedContent} />);

      await pressRow();

      expect(screen.queryByText("Extra settings")).not.toBeOnTheScreen();
    });
  });

  describe("toggle", () => {
    it("shows a switch and no chevron", async () => {
      await render(<SettingItem {...baseProps} right="toggle" />);

      expect(screen.getByRole("switch")).toBeOnTheScreen();
      expect(screen.queryByTestId("chevron")).not.toBeOnTheScreen();
    });

    it("reflects toggled={true}", async () => {
      await render(<SettingItem {...baseProps} right="toggle" toggled />);

      expect(screen.getByRole("switch")).toBeChecked();
    });

    it("reflects toggled={false}", async () => {
      await render(<SettingItem {...baseProps} right="toggle" toggled={false} />);

      expect(screen.getByRole("switch")).not.toBeChecked();
    });

    it("calls onToggle with the new value", async () => {
      const onToggle = jest.fn();
      await render(
        <SettingItem {...baseProps} right="toggle" toggled={false} onToggle={onToggle} />,
      );

      await fireEvent(screen.getByRole("switch"), "valueChange", true);

      expect(onToggle).toHaveBeenCalledWith(true);
    });

    it("still calls onPress when the row is pressed", async () => {
      const onPress = jest.fn();
      await render(<SettingItem {...baseProps} right="toggle" onPress={onPress} />);

      await pressRow();

      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});
