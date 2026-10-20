import { formatDates, getContacts, splitBullets } from "@/utils/cv";
import type { CVData } from "@/types/cv";
import { StyleSheet, Text, View } from "react-native";
import type { ReactNode } from "react";

// ─── SectionRow is defined outside the parent component to avoid re-creating it on every render ───

interface SectionRowProps {
  id: string;
  label: string;
  accent: string;
  highlightSection?: string;
  onSectionLayout?: (id: string, y: number) => void;
  children: ReactNode;
}

function SectionRow({
  id,
  label,
  accent,
  highlightSection,
  onSectionLayout,
  children,
}: SectionRowProps) {
  const hl =
    highlightSection === id
      ? {
          borderRadius: 4,
          borderWidth: 4,
          borderColor: accent + "8C",
          backgroundColor: accent + "12",
        }
      : {};

  return (
    <View style={[s.row, hl]} onLayout={(e) => onSectionLayout?.(id, e.nativeEvent.layout.y)}>
      <View style={s.rowLeft}>
        <Text style={[s.rowLabel, { color: accent }]}>{label}</Text>
      </View>
      <View style={s.rowRight}>{children}</View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  cv: CVData;
  highlightSection?: string;
  onSectionLayout?: (id: string, y: number) => void;
}

export default function MinimalTemplate({ cv, highlightSection, onSectionLayout }: Props) {
  const { accent, personal, summary, experience, education, skills } = cv;
  const contacts = getContacts(personal);

  const rowProps = { accent, highlightSection, onSectionLayout };

  const headerHl =
    highlightSection === "personal"
      ? {
          borderRadius: 4,
          borderWidth: 4,
          borderColor: accent + "8C",
          backgroundColor: accent + "12",
        }
      : {};

  return (
    <View style={s.page}>
      {/* Header */}
      <View
        style={[s.header, headerHl]}
        onLayout={(e) => onSectionLayout?.("personal", e.nativeEvent.layout.y)}
      >
        <Text style={s.name}>
          {personal.name || (
            <Text style={{ fontStyle: "italic", color: "#9AA3AF" }}>Your name</Text>
          )}
        </Text>
        {personal.title ? (
          <Text style={[s.jobTitle, { color: accent }]}>{personal.title}</Text>
        ) : null}
        {contacts.length > 0 && (
          <View style={s.contactRow}>
            {contacts.map((c, i) => (
              <Text key={i} style={s.contact}>
                {c}
                {i < contacts.length - 1 ? "  ·  " : ""}
              </Text>
            ))}
          </View>
        )}
      </View>

      {summary.length > 0 && (
        <SectionRow {...rowProps} id="summary" label="Profile">
          <Text style={s.body}>{summary}</Text>
        </SectionRow>
      )}

      {experience.length > 0 && (
        <SectionRow {...rowProps} id="experience" label="Experience">
          {experience.map((exp, idx) => (
            <View key={exp.id} style={idx > 0 ? { marginTop: 14 } : {}}>
              <Text style={s.expRole}>
                {exp.role}
                {exp.company ? `, ${exp.company}` : ""}
              </Text>
              <Text style={s.expDates}>{formatDates(exp.start, exp.end)}</Text>
              {splitBullets(exp.desc).map((b, i) => (
                <View key={i} style={s.bulletRow}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </SectionRow>
      )}

      {education.length > 0 && (
        <SectionRow {...rowProps} id="education" label="Education">
          {education.map((edu) => (
            <View key={edu.id}>
              <Text style={s.expRole}>{edu.degree}</Text>
              <Text style={s.expDates}>
                {[edu.school, formatDates(edu.start, edu.end)].filter(Boolean).join(", ")}
              </Text>
            </View>
          ))}
        </SectionRow>
      )}

      {skills.length > 0 && (
        <SectionRow {...rowProps} id="skills" label="Skills">
          <Text style={s.body}>{skills.join(", ")}</Text>
        </SectionRow>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  page: {
    width: 794,
    minHeight: 1123,
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 64,
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 40,
    fontWeight: "700",
    color: "#1E232B",
    letterSpacing: -0.8,
    lineHeight: 40 * 1.05,
  },
  jobTitle: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: 700,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 14,
  },
  contact: {
    fontSize: 13,
    color: "#4A5260",
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E1E5EB",
    paddingTop: 18,
    marginTop: 20,
    gap: 20,
  },
  rowLeft: {
    width: 140,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
  rowRight: {
    flex: 1,
  },
  body: {
    fontSize: 14,
    lineHeight: 14 * 1.55,
    color: "#1E232B",
  },
  expRole: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E232B",
  },
  expDates: {
    fontSize: 13.5,
    color: "#5A6270",
    marginBottom: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  bulletDot: {
    fontSize: 14,
    color: "#1E232B",
    marginRight: 6,
    lineHeight: 14 * 1.55,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: "#1E232B",
    lineHeight: 14 * 1.55,
  },
});
