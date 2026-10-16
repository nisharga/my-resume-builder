import { Image, Screen } from "@/components";
import { Pressable, Text, View } from "react-native";

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

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View className="mb-6 px-4">
    <Text className="mb-3 text-lg font-bold text-gray-900">{title}</Text>
    {children}
  </View>
);

export default function CreateResumeScreen() {
  return (
    <Screen
      className="bg-white"
      scroll
      stickyHeaderIndices={[1]}
      header={
        <View className="flex-row items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <Text className="text-lg font-bold">Resume</Text>
          <Text className="text-blue-600">Share</Text>
        </View>
      }
      footer={
        <View className="border-t border-gray-200 bg-white p-4">
          <Pressable className="items-center rounded-xl bg-black py-4">
            <Text className="font-semibold text-white">Download CV</Text>
          </Pressable>
        </View>
      }
    >
      <View className="items-center bg-gray-50 px-4 py-8">
        <Image src="https://i.pravatar.cc/300?img=12" className="w-28 rounded-full" />
        <Text className="mt-4 text-2xl font-bold">Rahim Ahmed</Text>
        <Text className="mt-1 text-gray-500">React Native Developer · Dhaka</Text>
      </View>

      <View className="flex-row justify-around border-b border-gray-200 bg-white py-3">
        <Text className="font-semibold">5+ Years</Text>
        <Text className="font-semibold">30 Projects</Text>
        <Text className="font-semibold">Open to work</Text>
      </View>

      <View className="pt-6">
        <Section title="About">
          <Text className="leading-6 text-gray-600">
            Mobile developer focused on fast, clean and reusable React Native apps. I enjoy building
            design systems and smooth user experiences.
          </Text>
        </Section>

        <Section title="Skills">
          <View className="flex-row flex-wrap gap-2">
            {skills.map((skill) => (
              <Text key={skill} className="rounded-full bg-gray-100 px-3 py-1 text-gray-700">
                {skill}
              </Text>
            ))}
          </View>
        </Section>

        <Section title="Experience">
          {experience.map((item) => (
            <View key={item.company} className="mb-4 rounded-xl bg-gray-50 p-4">
              <Text className="font-semibold">{item.role}</Text>
              <Text className="text-gray-500">
                {item.company} · {item.time}
              </Text>
              <Text className="mt-2 text-gray-600">{item.text}</Text>
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
              <Text className="font-semibold">{item.title}</Text>
              <Text className="text-gray-500">
                {item.place} · {item.time}
              </Text>
            </View>
          ))}
        </Section>

        <Section title="Contact">
          <Text className="text-gray-600">rahim@email.com</Text>
          <Text className="text-gray-600">+880 1700-000000</Text>
        </Section>
      </View>
    </Screen>
  );
}
