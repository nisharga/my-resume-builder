import { useState } from "react";
import { Image as ExpoImage, type ImageProps } from "expo-image";
import { styled } from "nativewind";

const StyledImage = styled(ExpoImage);

const FALLBACK = require("../../../assets/icon.png");

type Props = Omit<ImageProps, "source"> & {
  src?: string | number | null;
  fallback?: number;
  className?: string;
};

export default function Image({ src, fallback = FALLBACK, className, style, ...rest }: Props) {
  const [error, setError] = useState(false);
  const [ratio, setRatio] = useState<number>();

  const source = !src || error ? fallback : typeof src === "string" ? { uri: src } : src;

  return (
    <StyledImage
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      {...rest}
      source={source}
      className={className}
      style={[
        { aspectRatio: ratio ?? 16 / 9, backgroundColor: ratio ? undefined : "#e5e7eb" },
        style,
      ]}
      onLoad={(e) => setRatio(e.source.width / e.source.height)}
      onError={() => setError(true)}
    />
  );
}
