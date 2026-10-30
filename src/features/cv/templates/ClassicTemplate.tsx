import { formatDates, getContacts, getLinks, splitBullets } from "@/utils/cv";
import type { CVData } from "@/types/cv";
import { Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";

const SERIF = Platform.select({ ios: "Georgia", android: "serif" }) ?? "serif";

interface Props {
  cv: CVData;
  highlightSection?: string;
  onSectionLayout?: (id: string, y: number) => void;
}

export default function ClassicTemplate({ cv, highlightSection, onSectionLayout }: Props) {
  const { accent, personal, summary, experience, education, skills, achievements } = cv;
  const activeAchievements = (achievements ?? []).filter((a) => a.enabled && a.value.trim());
  const contacts = getContacts(personal);
  const links = getLinks(personal);

  function hl(id: string) {
    if (highlightSection !== id) return {};
    return {
      borderRadius: 4,
      borderWidth: 4,
      borderColor: accent + "8C",
      backgroundColor: accent + "12",
    };
  }

  function reportY(id: string) {
    return (e: any) => onSectionLayout?.(id, e.nativeEvent.layout.y);
  }

  return (
    <View style={s.page}>
      {/* ── Header / Personal ── */}
      <View
        style={[s.header, { borderBottomColor: accent }, hl("personal")]}
        onLayout={reportY("personal")}
      >
        <Text style={[s.name, { fontFamily: SERIF }]}>{personal.name || "Your name"}</Text>
        <Text style={[s.jobTitle, { color: accent, fontFamily: SERIF }]}>{personal.title}</Text>
        <View style={s.contactRow}>
          {contacts.map((c, i) => (
            <Text key={i} style={[s.contact, { fontFamily: SERIF }]}>
              {c}
            </Text>
          ))}
          {links.map((link, i) => (
            <Pressable key={`link-${i}`} onPress={() => Linking.openURL(link.url)}>
              <Text style={[s.contact, s.link, { fontFamily: SERIF, color: accent }]}>
                {link.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Summary / Profile ── */}
      {summary.length > 0 && (
        <View style={hl("summary")} onLayout={reportY("summary")}>
          <Text style={[s.sectionHeading, { color: accent, fontFamily: SERIF }]}>Profile</Text>
          <View style={[s.sectionLine, { borderBottomColor: "#DDE1E7" }]} />
          <Text style={[s.body, { fontFamily: SERIF }]}>{summary}</Text>
        </View>
      )}

      {/* ── Experience ── */}
      {experience.length > 0 && (
        <View style={hl("experience")} onLayout={reportY("experience")}>
          <Text style={[s.sectionHeading, { color: accent, fontFamily: SERIF }]}>Experience</Text>
          <View style={[s.sectionLine, { borderBottomColor: "#DDE1E7" }]} />
          {experience.map((exp) => (
            <View key={exp.id} style={s.entry}>
              <View style={s.entryHeader}>
                <Text style={[s.entryRole, { fontFamily: SERIF }]}>{exp.role}</Text>
                <Text style={[s.entryDates, { fontFamily: SERIF }]}>
                  {formatDates(exp.start, exp.end)}
                </Text>
              </View>
              <Text style={[s.entryCompany, { fontFamily: SERIF }]}>{exp.company}</Text>
              {splitBullets(exp.desc).map((b, i) => (
                <View key={i} style={s.bulletRow}>
                  <Text style={[s.bulletDot, { fontFamily: SERIF }]}>•</Text>
                  <Text style={[s.bulletText, { fontFamily: SERIF }]}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* ── Education ── */}
      {education.length > 0 && (
        <View style={hl("education")} onLayout={reportY("education")}>
          <Text style={[s.sectionHeading, { color: accent, fontFamily: SERIF }]}>Education</Text>
          <View style={[s.sectionLine, { borderBottomColor: "#DDE1E7" }]} />
          {education.map((edu) => (
            <View key={edu.id} style={s.entry}>
              <View style={s.entryHeader}>
                <Text style={[s.entryRole, { fontFamily: SERIF }]}>{edu.degree}</Text>
                <Text style={[s.entryDates, { fontFamily: SERIF }]}>
                  {formatDates(edu.start, edu.end)}
                </Text>
              </View>
              <Text style={[s.entryCompany, { fontFamily: SERIF }]}>{edu.school}</Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <View style={hl("skills")} onLayout={reportY("skills")}>
          <Text style={[s.sectionHeading, { color: accent, fontFamily: SERIF }]}>Skills</Text>
          <View style={[s.sectionLine, { borderBottomColor: "#DDE1E7" }]} />
          <View style={s.skillsRow}>
            {skills.map((sk, i) => (
              <Text key={i} style={[s.skill, { fontFamily: SERIF }]}>
                {sk}
                {i < skills.length - 1 ? "  ·  " : ""}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* ── Additional Fields ── */}
      {activeAchievements.length > 0 && (
        <View style={hl("additional")} onLayout={reportY("additional")}>
          <Text style={[s.sectionHeading, { color: accent, fontFamily: SERIF }]}>Additional</Text>
          <View style={[s.sectionLine, { borderBottomColor: "#DDE1E7" }]} />
          {activeAchievements.map((a) => (
            <View key={a.id} style={s.entry}>
              <Text style={[s.entryRole, { fontFamily: SERIF }]}>{a.name}</Text>
              <Text style={[s.body, { fontFamily: SERIF }]}>{a.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: {
    width: 794,
    minHeight: 1123,
    backgroundColor: "#FFFFFF",
    paddingTop: 64,
    paddingBottom: 64,
    paddingHorizontal: 72,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 2,
    paddingBottom: 18,
    marginBottom: 22,
  },
  name: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1E232B",
  },
  jobTitle: {
    fontSize: 17,
    marginTop: 2,
    fontWeight: 700,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
    gap: 4,
  },
  contact: {
    fontSize: 13.5,
    color: "#4A5260",
    marginHorizontal: 8,
  },
  link: {
    fontWeight: "600" as const,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 22,
    marginBottom: 4,
    paddingBottom: 4,
  },
  sectionLine: {
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  body: {
    fontSize: 14.5,
    lineHeight: 14.5 * 1.55,
    color: "#1E232B",
  },
  entry: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryRole: {
    fontSize: 14.5,
    fontWeight: "600",
    color: "#1E232B",
    flex: 1,
  },
  entryDates: {
    fontSize: 13.5,
    color: "#5A6270",
  },
  entryCompany: {
    fontSize: 14.5,
    fontStyle: "italic",
    color: "#4A5260",
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  bulletDot: {
    fontSize: 14.5,
    color: "#1E232B",
    marginRight: 6,
    lineHeight: 14.5 * 1.55,
  },
  bulletText: {
    flex: 1,
    fontSize: 14.5,
    color: "#1E232B",
    lineHeight: 14.5 * 1.55,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skill: {
    fontSize: 14.5,
    color: "#1E232B",
    lineHeight: 14.5 * 1.55,
  },
});
