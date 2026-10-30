import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from "docx";
import type { CVData } from "@/types/cv";
import { getCV } from "@/utils/cvStorage";
import { cvToHtml } from "@/utils/cvToHtml";
import { formatDates, getContacts, getLinks, splitBullets } from "@/utils/cv";

// Share a CV that is already loaded in memory
export async function shareCVData(cv: CVData, format: "PDF" | "DOCX"): Promise<void> {
  if (format === "PDF") {
    await sharePDF(cv);
  } else {
    await shareDocx(cv);
  }
}

// Convenience: load CV from storage then share — used from Notifications screen
export async function shareCV(cvId: string, format: "PDF" | "DOCX"): Promise<void> {
  const cv = await getCV(cvId);
  if (!cv) throw new Error("CV not found");
  await shareCVData(cv, format);
}

// ─── internal helpers ─────────────────────────────────────────────────────────

async function sharePDF(cv: CVData): Promise<void> {
  const html = cvToHtml(cv);
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  await Sharing.shareAsync(uri, { mimeType: "application/pdf", UTI: "com.adobe.pdf" });
  // clean up temp file after share sheet closes
  FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
}

async function shareDocx(cv: CVData): Promise<void> {
  const base64 = await buildDocxBase64(cv);
  const name = slugName(cv);
  const dest = `${FileSystem.cacheDirectory}${name}.docx`;
  const mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  await FileSystem.writeAsStringAsync(dest, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  await Sharing.shareAsync(dest, { mimeType, UTI: "org.openxmlformats.wordprocessingml.document" });

  FileSystem.deleteAsync(dest, { idempotent: true }).catch(() => {});
}

function slugName(cv: CVData): string {
  const name = cv.personal.name.replace(/\s+/g, "_").toLowerCase() || "resume";
  return `${name}_cv`;
}

async function buildDocxBase64(cv: CVData): Promise<string> {
  const { accent, personal, summary, experience, education, skills } = cv;
  const contacts = [...getContacts(personal), ...getLinks(personal).map((l) => l.label)];
  const accentHex = accent.replace("#", "");

  function sectionHeading(text: string) {
    return new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: accentHex, space: 4 },
      },
      run: { color: accentHex, bold: true, size: 28 },
    });
  }

  const children: Paragraph[] = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [new TextRun({ text: personal.name || "Your Name", bold: true, size: 52 })],
    }),
  );

  if (personal.title) {
    children.push(
      new Paragraph({
        spacing: { after: 60 },
        children: [new TextRun({ text: personal.title, color: accentHex, size: 28, bold: true })],
      }),
    );
  }

  if (contacts.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: contacts.join(" · "), color: "4A5260", size: 22 })],
      }),
    );
  }

  if (summary) {
    children.push(sectionHeading("Profile"));
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: summary, size: 22 })],
      }),
    );
  }

  if (experience.length > 0) {
    children.push(sectionHeading("Experience"));
    experience.forEach((exp) => {
      children.push(
        new Paragraph({
          spacing: { after: 20 },
          children: [
            new TextRun({ text: exp.role, bold: true, color: accentHex, size: 24 }),
            exp.company
              ? new TextRun({ text: `  ·  ${exp.company}`, color: "4A5260", size: 22 })
              : new TextRun(""),
            new TextRun({
              text: `   ${formatDates(exp.start, exp.end)}`,
              color: "5A6270",
              size: 20,
            }),
          ],
        }),
      );
      splitBullets(exp.desc).forEach((b) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 20 },
            children: [new TextRun({ text: b, size: 22 })],
          }),
        );
      });
    });
  }

  if (education.length > 0) {
    children.push(sectionHeading("Education"));
    education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { after: 20 },
          children: [
            new TextRun({ text: edu.degree, bold: true, color: accentHex, size: 24 }),
            new TextRun({ text: `  ·  ${edu.school}`, color: "4A5260", size: 22 }),
            new TextRun({
              text: `   ${formatDates(edu.start, edu.end)}`,
              color: "5A6270",
              size: 20,
            }),
          ],
        }),
      );
    });
  }

  if (skills.length > 0) {
    children.push(sectionHeading("Skills"));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: skills.join(" · "), size: 22 })],
      }),
    );
  }

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBase64String(doc);
}
