import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Platform } from "react-native";
import { render, screen } from "@testing-library/react-native";

import { AndroidNavSpacer } from "@/components/core";

const insets = (bottom: number) => ({ top: 0, right: 0, left: 0, bottom });

const mockUseSafeAreaInsets = jest.fn(() => insets(0));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => mockUseSafeAreaInsets(),
}));

const setPlatform = (os: typeof Platform.OS) => {
  jest.replaceProperty(Platform, "OS", os);
};

beforeEach(() => {
  mockUseSafeAreaInsets.mockReturnValue(insets(0));
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("AndroidNavSpacer", () => {
  describe("on Android", () => {
    beforeEach(() => setPlatform("android"));

    it("renders a spacer as tall as the bottom inset", async () => {
      mockUseSafeAreaInsets.mockReturnValue(insets(48));

      await render(<AndroidNavSpacer />);

      expect(screen.toJSON()).toMatchObject({
        type: "View",
        props: { style: { height: 48 } },
      });
    });

    it("renders nothing when there is no bottom inset", async () => {
      mockUseSafeAreaInsets.mockReturnValue(insets(0));

      await render(<AndroidNavSpacer />);

      expect(screen.toJSON()).toBeNull();
    });

    it("updates its height when the inset changes", async () => {
      mockUseSafeAreaInsets.mockReturnValue(insets(24));
      await render(<AndroidNavSpacer />);
      expect(screen.toJSON()).toMatchObject({ props: { style: { height: 24 } } });

      mockUseSafeAreaInsets.mockReturnValue(insets(56));
      await screen.rerender(<AndroidNavSpacer />);

      expect(screen.toJSON()).toMatchObject({ props: { style: { height: 56 } } });
    });
  });

  describe("on iOS", () => {
    beforeEach(() => setPlatform("ios"));

    it("renders nothing, even with a bottom inset", async () => {
      mockUseSafeAreaInsets.mockReturnValue(insets(34));

      await render(<AndroidNavSpacer />);

      expect(screen.toJSON()).toBeNull();
    });
  });

  describe("on web", () => {
    beforeEach(() => setPlatform("web"));

    it("renders nothing, even with a bottom inset", async () => {
      mockUseSafeAreaInsets.mockReturnValue(insets(20));

      await render(<AndroidNavSpacer />);

      expect(screen.toJSON()).toBeNull();
    });
  });
});
