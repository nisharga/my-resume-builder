import { useLanguage } from "@/src/context";
import { colors } from "@/src/theme";
import React from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DealsIllustration,
  DeliveryIllustration,
  DiscoverIllustration,
} from "./OnboardingIllustrations";
import { setOnboardingCompleted } from "@/src/constants";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { setOnboarded } from "@/src/redux/features/authSlice";

const OnboardingScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const completeOnboarding = async () => {
    try {
      // 1. Update Redux FIRST
      // This tells the RootLayoutNav: "Hey, we are done here!"
      dispatch(setOnboarded(true));

      // 2. Persist it to disk
      await setOnboardingCompleted();

      // 3. REMOVE router.push/replace from here.
      // Your RootLayoutNav useEffect will detect the Redux change
      // and handle the redirect automatically.
    } catch (error) {
      console.error("Failed to complete onboarding", error);
    }
  };

  const { t } = useLanguage();
  // Define slides inside the component to respond to language changes
  const slides = [
    {
      key: "deals",
      title: t("onboarding.deals.title"),
      text: t("onboarding.deals.text"),
      illustration: DealsIllustration,
      backgroundColor: colors.primary,
    },
    {
      key: "deliver",
      title: t("onboarding.deliver.title"),
      text: t("onboarding.deliver.text"),
      illustration: DeliveryIllustration,
      backgroundColor: colors.primary,
    },
    {
      key: "discover",
      title: t("onboarding.discover.title"),
      text: t("onboarding.discover.text"),
      illustration: DiscoverIllustration,
      backgroundColor: colors.primary,
    },
  ];

  interface IProps {
    key: string;
    title: string;
    text: string;
    illustration: React.ComponentType;
    backgroundColor: string;
  }

  const renderItem = ({ item }: { item: IProps }) => {
    const IllustrationComponent = item.illustration;
    return (
      <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={styles.content}>
          <View style={styles.illustrationWrapper}>
            <IllustrationComponent />
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  const onDonePress = async () => {
    await completeOnboarding();
  };

  const onSkipPress = async () => {
    await completeOnboarding();
  };

  const renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.buttonText}>→</Text>
      </View>
    );
  };

  const renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Text style={styles.buttonText}>✓</Text>
      </View>
    );
  };

  const renderSkipButton = () => {
    return (
      <View style={styles.skipButton}>
        <Text style={styles.skipButtonText}>{t("skip")}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
        animated={true}
      />
      <AppIntroSlider
        data={slides}
        renderItem={renderItem}
        onDone={onDonePress}
        onSkip={onSkipPress}
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        renderSkipButton={renderSkipButton}
        showSkipButton
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  illustrationWrapper: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Poppins-Bold",
  },
  text: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  buttonCircle: {
    width: 44,
    height: 44,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.text.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  skipButtonText: {
    color: colors.text.white,
    fontSize: 16,
    fontWeight: "600",
  },
  dotStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDotStyle: {
    backgroundColor: colors.text.white,
    width: 24,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default OnboardingScreen;
