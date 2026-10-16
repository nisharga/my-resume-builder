import { Header, Image, Screen, Section, StickyView } from "@/components";
import { Text, View } from "react-native";

const skills = [
  "React Native",
  "Expo",
  "TypeScript",
  "NativeWind",
  "Node.js",
  "REST API",
  "Git",
  "Figma",
];

const experience = [
  {
    role: "Senior Mobile Developer",
    company: "Pathao",
    time: "2024 - Present",
    text: "Built and shipped features for a ride sharing app used by millions.",
  },
  {
    role: "React Native Developer",
    company: "bKash",
    time: "2022 - 2024",
    text: "Worked on payment flows, performance and offline support.",
  },
  {
    role: "Frontend Developer",
    company: "Brain Station 23",
    time: "2020 - 2022",
    text: "Built web dashboards with React and TypeScript.",
  },
];

const education = [
  { title: "BSc in Computer Science", place: "University of Dhaka", time: "2016 - 2020" },
  { title: "HSC, Science", place: "Dhaka College", time: "2014 - 2016" },
];

export default function CreateResumeScreen() {
  return (
    <Screen>
      {/* Scrolls away with content */}
      <Header title="Resume" right={<Text className="text-base text-primary">Share</Text>} />

      {/* sticky — Screen auto-detects this and pins it */}
      <StickyView
        sticky
        className="flex-row justify-around border-b border-border bg-background py-3"
      >
        <Text className="font-semibold text-foreground">5+ Years</Text>
        <Text className="font-semibold text-foreground">30 Projects</Text>
        <Text className="font-semibold text-foreground">Open to work</Text>
      </StickyView>

      {/* ── Profile hero ─────────────────────────────────────────── */}
      <View className="items-center bg-secondary/30 px-4 py-8">
        <Image src="https://i.pravatar.cc/300?img=12" className="w-28 rounded-full" />
        <Text className="mt-4 text-2xl font-bold text-heading">Rahim Ahmed</Text>
        <Text className="mt-1 text-body">React Native Developer · Dhaka</Text>
      </View>

      {/* ── Sections ─────────────────────────────────────────────── */}
      <View className="pt-6 pb-10">
        <Section title="About">
          <Text className="leading-6 text-body">
            Mobile developer focused on fast, clean and reusable React Native apps. I enjoy building
            design systems and smooth user experiences.
          </Text>
        </Section>

        <Section title="Skills">
          <View className="flex-row flex-wrap gap-2">
            {skills.map((skill) => (
              <Text key={skill} className="rounded-full bg-secondary px-3 py-1 text-foreground">
                {skill}
              </Text>
            ))}
          </View>
        </Section>

        <Section title="Experience">
          {experience.map((item) => (
            <View key={item.company} className="mb-4 rounded-xl bg-secondary/30 p-4">
              <Text className="font-semibold text-foreground">{item.role}</Text>
              <Text className="text-body">
                {item.company} · {item.time}
              </Text>
              <Text className="mt-2 text-body">{item.text}</Text>
            </View>
          ))}
        </Section>

        <Section title="Projects">
          <Image src="https://picsum.photos/800/450" className="mb-3 w-full rounded-xl" />
          <Image src="https://picsum.photos/1200/300" className="w-full rounded-xl" />
        </Section>

        <Section title="Education">
          {education.map((item) => (
            <View key={item.title} className="mb-3">
              <Text className="font-semibold text-foreground">{item.title}</Text>
              <Text className="text-body">
                {item.place} · {item.time}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Contact">
          <Text className="text-body">rahim@email.com</Text>
          <Text className="text-body">+880 1700-000000</Text>
        </Section>
      </View>
    </Screen>
  );
}
