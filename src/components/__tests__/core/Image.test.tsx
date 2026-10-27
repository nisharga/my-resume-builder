import { StyleSheet } from "react-native";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Image } from "@/components/core";

// Replace expo-image with a plain View so we can inspect the props it receives
// and fire onLoad / onError ourselves.
jest.mock("expo-image", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    Image: (props: Record<string, unknown>) => React.createElement(View, props),
  };
});

// nativewind's styled() just passes the component through in tests.
jest.mock("nativewind", () => ({
  styled: (Component: unknown) => Component,
}));

const DEFAULT_FALLBACK = require("../../../../assets/icon.png");
const CUSTOM_FALLBACK = 42;
const TEST_ID = "image";

const getImage = () => screen.getByTestId(TEST_ID);
const getStyle = () => StyleSheet.flatten(getImage().props.style);

describe("Image", () => {
  describe("source", () => {
    it("wraps a string src in a { uri } object", async () => {
      await render(<Image testID={TEST_ID} src="https://example.com/a.png" />);

      expect(getImage().props.source).toEqual({ uri: "https://example.com/a.png" });
    });

    it("passes a numeric src (local require) through unchanged", async () => {
      await render(<Image testID={TEST_ID} src={7} />);

      expect(getImage().props.source).toBe(7);
    });

    it.each([undefined, null, ""])("uses the default fallback when src is %p", async (src) => {
      await render(<Image testID={TEST_ID} src={src} />);

      expect(getImage().props.source).toBe(DEFAULT_FALLBACK);
    });

    it("uses a custom fallback when provided", async () => {
      await render(<Image testID={TEST_ID} fallback={CUSTOM_FALLBACK} />);

      expect(getImage().props.source).toBe(CUSTOM_FALLBACK);
    });

    it("switches to the fallback when the image fails to load", async () => {
      await render(
        <Image testID={TEST_ID} src="https://example.com/broken.png" fallback={CUSTOM_FALLBACK} />,
      );
      expect(getImage().props.source).toEqual({ uri: "https://example.com/broken.png" });

      await fireEvent(getImage(), "error");

      expect(getImage().props.source).toBe(CUSTOM_FALLBACK);
    });
  });

  describe("aspect ratio and placeholder", () => {
    it("defaults to 16:9 with a grey placeholder background before load", async () => {
      await render(<Image testID={TEST_ID} src="https://example.com/a.png" />);

      expect(getStyle()).toMatchObject({
        aspectRatio: 16 / 9,
        backgroundColor: "#e5e7eb",
      });
    });

    it("uses the loaded image's real ratio and drops the placeholder", async () => {
      await render(<Image testID={TEST_ID} src="https://example.com/a.png" />);

      await fireEvent(getImage(), "load", { source: { width: 400, height: 200 } });

      const style = getStyle();
      expect(style.aspectRatio).toBe(2);
      expect(style.backgroundColor).toBeUndefined();
    });

    it("lets the style prop override the computed styles", async () => {
      await render(
        <Image
          testID={TEST_ID}
          src="https://example.com/a.png"
          style={{ aspectRatio: 1, width: 50 }}
        />,
      );

      expect(getStyle()).toMatchObject({ aspectRatio: 1, width: 50 });
    });
  });

  describe("props", () => {
    it("applies sensible defaults", async () => {
      await render(<Image testID={TEST_ID} src="https://example.com/a.png" />);

      expect(getImage().props).toMatchObject({
        contentFit: "cover",
        transition: 200,
        cachePolicy: "memory-disk",
      });
    });

    it("allows the defaults to be overridden", async () => {
      await render(
        <Image
          testID={TEST_ID}
          src="https://example.com/a.png"
          contentFit="contain"
          transition={0}
          cachePolicy="none"
        />,
      );

      expect(getImage().props).toMatchObject({
        contentFit: "contain",
        transition: 0,
        cachePolicy: "none",
      });
    });
  });
});
