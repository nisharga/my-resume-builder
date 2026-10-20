import { formatDates, getContacts, getLinks, splitBullets } from "@/utils/cv";
import type { CVData } from "@/types/cv";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

// Blend accent with white: accent * (1 - t) + white * t
function tintAccent(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - t) + 255 * t);
  const g = Math.round(((n >> 8) & 255) * (1 - t) + 255 * t);
  const b = Math.round((n & 255) * (1 - t) + 255 * t);
  return `rgb(${r},${g},${b})`;
}

interface Props {
  cv: CVData;
  highlightSection?: string;
  onSectionLayout?: (id: string, y: number) => void;
}

export default function SidebarTemplate({ cv, highlightSection, onSectionLayout }: Props) {
  const { accent, personal, summary, experience, education, skills } = cv;
  const contacts = getContacts(personal);
  const links = getLinks(personal);
  const leftBorderColor = tintAccent(accent, 0.3);

  function sectionStyle(id: string) {
    if (highlightSection !== id) return {};
    return {
      borderRadius: 4,
      borderWidth: 4,
      borderColor: accent + "8C", // 55% opacity
      backgroundColor: accent + "12", // 7% opacity
    };
  }

  function reportY(id: string) {
    return (e: any) => {
      onSectionLayout?.(id, e.nativeEvent.layout.y);
    };
  }

  return (
    <View style={s.page}>
      {/* ── Sidebar ── */}
      <View style={[s.sidebar, { backgroundColor: accent }]}>
        {/* Name / Title */}
        <View style={sectionStyle("personal")} onLayout={reportY("personal")}>
          <Text style={s.sName}>{personal.name || "Your name"}</Text>
          <Text style={s.sTitle}>{personal.title}</Text>
        </View>

        {/* Contact */}
        {(contacts.length > 0 || links.length > 0) && (
          <View style={s.sSection}>
            <Text style={s.sHeading}>Contact</Text>
            <View style={[s.sDivider, { borderColor: "rgba(255,255,255,0.35)" }]} />
            {contacts.map((c, i) => (
              <Text key={i} style={s.sContact}>
                {c}
              </Text>
            ))}
            {links.map((link, i) => (
              <Pressable key={`link-${i}`} onPress={() => Linking.openURL(link.url)}>
                <Text style={[s.sContact, s.sLink]}>{link.label}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View style={s.sSection}>
            <Text style={s.sHeading}>Skills</Text>
            <View style={[s.sDivider, { borderColor: "rgba(255,255,255,0.35)" }]} />
            <View style={s.chipRow}>
              {skills.map((sk, i) => (
                <View key={i} style={s.chip}>
                  <Text style={s.chipText}>{sk}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View style={s.sSection}>
            <Text style={s.sHeading}>Education</Text>
            <View style={[s.sDivider, { borderColor: "rgba(255,255,255,0.35)" }]} />
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: 10 }}>
                <Text style={[s.sContact, { fontWeight: "700" }]}>{edu.degree}</Text>
                <Text style={s.sContact}>{edu.school}</Text>
                <Text style={[s.sContact, { opacity: 0.85 }]}>
                  {formatDates(edu.start, edu.end)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ── Main ── */}
      <View style={s.main}>
        {/* Summary / About me */}
        {summary.length > 0 && (
          <View style={[s.mainSection, sectionStyle("summary")]} onLayout={reportY("summary")}>
            <Text style={[s.mHeading, { color: accent }]}>About me</Text>
            <Text style={s.mBody}>{summary}</Text>
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View
            style={[s.mainSection, sectionStyle("experience")]}
            onLayout={reportY("experience")}
          >
            <Text style={[s.mHeading, { color: accent }]}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={[s.expEntry, { borderLeftColor: leftBorderColor }]}>
                <Text style={s.expRole}>{exp.role}</Text>
                <Text style={s.expMeta}>
                  {[exp.company, formatDates(exp.start, exp.end)].filter(Boolean).join(", ")}
                </Text>
                {splitBullets(exp.desc).map((b, i) => (
                  <View key={i} style={s.bulletRow}>
                    <Text style={s.bulletDot}>•</Text>
                    <Text style={s.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const WHITE = "#FFFFFF";
const s = StyleSheet.create({
  page: {
    width: 794,
    minHeight: 1123,
    backgroundColor: WHITE,
    flexDirection: "row",
  },
  // ── Sidebar ──
  sidebar: {
    width: 250,
    minHeight: 1123,
    paddingVertical: 52,
    paddingHorizontal: 26,
  },
  sName: {
    fontSize: 28,
    fontWeight: "700",
    color: WHITE,
    lineHeight: 28 * 1.15,
    marginBottom: 6,
  },
  sTitle: {
    fontSize: 15,
    color: WHITE,
    opacity: 0.9,
    marginBottom: 28,
    fontWeight: 700,
  },
  sSection: {
    marginTop: 24,
  },
  sHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: WHITE,
    marginBottom: 8,
  },
  sDivider: {
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  sContact: {
    fontSize: 13,
    color: WHITE,
    marginBottom: 6,
    lineHeight: 18,
  },
  sLink: {
    opacity: 1,
    fontWeight: "600" as const,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginRight: 4,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 12.5,
    color: WHITE,
  },
  // ── Main ──
  main: {
    flex: 1,
    paddingVertical: 52,
    paddingHorizontal: 40,
  },
  mainSection: {
    marginBottom: 26,
  },
  mHeading: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  mBody: {
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: "#1E232B",
  },
  expEntry: {
    borderLeftWidth: 2,
    paddingLeft: 14,
    marginBottom: 14,
  },
  expRole: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E232B",
  },
  expMeta: {
    fontSize: 13.5,
    color: "#4A5260",
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 0,
  },
  bulletDot: {
    fontSize: 14,
    color: "#1E232B",
    marginRight: 6,
    lineHeight: 14 * 1.5,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#1E232B",
    lineHeight: 14 * 1.5,
  },
});
