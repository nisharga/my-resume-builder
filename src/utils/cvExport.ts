import { Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { cvToHtml } from "./cvToHtml";
import { formatDates, getContacts, getLinks, splitBullets } from "./cv";

const SAF_FOLDER_KEY = "saf_export_folder_uri";

// ─── Android SAF helpers ──────────────────────────────────────────────────────

async function getOrPickFolder(): Promise<string | null> {
  // Reuse previously granted folder if still valid
  const cached = await AsyncStorage.getItem(SAF_FOLDER_KEY);
  if (cached) {
    try {
      await FileSystem.StorageAccessFramework.readDirectoryAsync(cached);
      return cached;
    } catch {
      // Permission expired — ask again
      await AsyncStorage.removeItem(SAF_FOLDER_KEY);
    }
  }

  const result = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!result.granted) return null;

  await AsyncStorage.setItem(SAF_FOLDER_KEY, result.directoryUri);
  return result.directoryUri;
}

async function safWrite(
  folderUri: string,
  fileName: string,
  mimeType: string,
  base64Content: string,
): Promise<void> {
  const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
    folderUri,
    fileName,
    mimeType,
  );
  await FileSystem.StorageAccessFramework.writeAsStringAsync(destUri, base64Content, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

// ─── PDF ─────────────────────────────────────────────────────────────────────

export async function exportAsPDF(cv: CVData): Promise<"saved" | "cancelled"> {
  const html = cvToHtml(cv);
  const { uri } = await Print.printToFileAsync({ html, base64: false });

  if (Platform.OS === "android") {
    const folderUri = await getOrPickFolder();
    if (!folderUri) return "cancelled";

    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await safWrite(folderUri, `${slugName(cv)}.pdf`, "application/pdf", base64);
    return "saved";
  }

  // iOS: documentDirectory is visible in Files app → On My iPhone → [App Name]
  const dest = `${FileSystem.documentDirectory}${slugName(cv)}.pdf`;
  await FileSystem.moveAsync({ from: uri, to: dest });
  return "saved";
}

// ─── DOCX ────────────────────────────────────────────────────────────────────

export async function exportAsDocx(cv: CVData): Promise<"saved" | "cancelled"> {
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
  const base64 = await Packer.toBase64String(doc);
  const fileName = `${slugName(cv)}.docx`;
  const mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  if (Platform.OS === "android") {
    const folderUri = await getOrPickFolder();
    if (!folderUri) return "cancelled";
    await safWrite(folderUri, fileName, mimeType, base64);
    return "saved";
  }

  // iOS
  const dest = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(dest, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return "saved";
}

// ─── Share (fallback / optional) ─────────────────────────────────────────────

export async function shareFile(filePath: string, mimeType: string): Promise<void> {
  await Sharing.shareAsync(filePath, { mimeType });
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function slugName(cv: CVData): string {
  const name = cv.personal.name.replace(/\s+/g, "_").toLowerCase() || "resume";
  return `${name}_cv`;
}
