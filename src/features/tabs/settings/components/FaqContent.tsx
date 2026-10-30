import { fontFamilyTheme } from "@/styles";
import { colors } from "@/styles/colors";
import { Text, View } from "react-native";

const FAQ_ITEMS = [
  {
    q: "How many resumes can I build?",
    a: "Unlimited! Create as many resumes as you need, all stored safely in the app.",
  },
  {
    q: "How many resumes can I import?",
    a: "Unlimited. Import as many existing resumes as you like using the AI-powered import feature.",
  },
  {
    q: "Can I send my resume directly to email?",
    a: "Yes! Tap the Share button in the preview screen to send your resume directly via email or any messaging app.",
  },
  {
    q: "Will my resume be saved if I close the app?",
    a: "Your resume is only saved after you export it as a PDF or Google Doc. Always download before closing the app to avoid losing your work.",
  },
  {
    q: "Does importing a resume require an internet connection?",
    a: "Yes, the AI-powered import feature needs an active internet connection to read and fill in your resume data automatically.",
  },
];

export default function FaqContent() {
  return (
    <View className="gap-3 py-1">
      {FAQ_ITEMS.map((item, i) => (
        <View
          key={i}
          className={`gap-1 ${i < FAQ_ITEMS.length - 1 ? "border-b border-border pb-3" : ""}`}
        >
          <Text
            style={{ fontFamily: fontFamilyTheme.semiBold, fontSize: 13, color: colors.foreground }}
          >
            {item.q}
          </Text>
          <Text
            style={{
              fontFamily: fontFamilyTheme.regular,
              fontSize: 12,
              color: colors.mutedForeground,
              lineHeight: 18,
            }}
          >
            {item.a}
          </Text>
        </View>
      ))}
    </View>
  );
}
