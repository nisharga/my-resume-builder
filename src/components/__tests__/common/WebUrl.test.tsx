import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, screen, userEvent } from "@testing-library/react-native";
import * as WebBrowser from "expo-web-browser";
import { colors } from "@/styles/colors";
import { WebUrl } from "@/components/common";
import { fontFamilyTheme } from "@/styles";

jest.mock("expo-web-browser", () => ({
  openBrowserAsync: jest.fn(),
}));

const props = {
  url: "https://example.com/privacy",
  title: "Privacy Policy",
  label: "Read our privacy policy",
};

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .mocked(WebBrowser.openBrowserAsync)
    .mockResolvedValue({ type: "dismiss" } as WebBrowser.WebBrowserResult);
});

describe("WebUrl", () => {
  it("renders the label", async () => {
    await render(<WebUrl {...props} />);

    expect(screen.getByText("Read our privacy policy")).toBeOnTheScreen();
  });

  it("does not render the title", async () => {
    await render(<WebUrl {...props} />);

    expect(screen.queryByText("Privacy Policy")).not.toBeOnTheScreen();
  });

  it("styles the label as a link in the primary color", async () => {
    await render(<WebUrl {...props} />);

    expect(screen.getByText("Read our privacy policy")).toHaveStyle({
      color: colors.primary,
      fontSize: 12,
      fontFamily: fontFamilyTheme.semiBold,
    });
  });

  it("opens the url in the in-app browser when pressed", async () => {
    const user = userEvent.setup();
    await render(<WebUrl {...props} />);

    await user.press(screen.getByText("Read our privacy policy"));

    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledTimes(1);
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith("https://example.com/privacy");
  });

  it("opens whichever url it was given", async () => {
    const user = userEvent.setup();
    await render(<WebUrl {...props} url="https://example.com/terms" label="Terms" />);

    await user.press(screen.getByText("Terms"));

    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith("https://example.com/terms");
  });

  it("does not open the browser until pressed", async () => {
    await render(<WebUrl {...props} />);

    expect(WebBrowser.openBrowserAsync).not.toHaveBeenCalled();
  });
});
