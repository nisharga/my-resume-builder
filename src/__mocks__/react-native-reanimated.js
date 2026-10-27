const { View, Text, ScrollView, FlatList } = require("react-native");

const Animated = {
  View,
  Text,
  ScrollView,
  FlatList,
  createAnimatedComponent: (c) => c,
};

const useSharedValue = (init) => ({ value: init });
const useAnimatedStyle = (fn) => {
  try {
    return fn();
  } catch {
    return {};
  }
};
const withSpring = (v) => v;
const withTiming = (v) => v;
const withRepeat = (v) => v;
const withSequence = (...args) => args[args.length - 1];
const withDelay = (_, v) => v;
const runOnJS = (fn) => fn;
const runOnUI = (fn) => fn;
const cancelAnimation = () => {};
const interpolate = (_, _in, out) => out[0];
const Extrapolation = { CLAMP: "clamp", EXTEND: "extend", IDENTITY: "identity" };

const makeBuilder = () => {
  const builder = {
    duration: () => builder,
    delay: () => builder,
    springify: () => builder,
    damping: () => builder,
    stiffness: () => builder,
    mass: () => builder,
    withInitialValues: () => builder,
    build: () => () => ({ initialValues: {}, animations: {} }),
  };
  return builder;
};

module.exports = {
  default: Animated,
  ...Animated,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  runOnJS,
  runOnUI,
  cancelAnimation,
  interpolate,
  Extrapolation,
  FadeIn: makeBuilder(),
  FadeInDown: makeBuilder(),
  FadeInUp: makeBuilder(),
  FadeOut: makeBuilder(),
  FadeOutDown: makeBuilder(),
  FadeOutUp: makeBuilder(),
  SlideInRight: makeBuilder(),
  SlideInLeft: makeBuilder(),
  SlideOutRight: makeBuilder(),
  SlideOutLeft: makeBuilder(),
  ZoomIn: makeBuilder(),
  ZoomOut: makeBuilder(),
  Layout: makeBuilder(),
};
