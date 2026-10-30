import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "@export_history_v1";
const MAX_RECORDS = 30;

export interface ExportRecord {
  id: string;
  cvId: string;
  cvName: string;
  format: "PDF" | "DOCX";
  timestamp: number;
}

export async function getExportHistory(): Promise<ExportRecord[]> {
  const json = await AsyncStorage.getItem(KEY);
  return json ? (JSON.parse(json) as ExportRecord[]) : [];
}

export async function addExportRecord(
  cvId: string,
  cvName: string,
  format: "PDF" | "DOCX",
): Promise<void> {
  const list = await getExportHistory();
  const record: ExportRecord = {
    id: Date.now().toString(),
    cvId,
    cvName,
    format,
    timestamp: Date.now(),
  };
  const updated = [record, ...list].slice(0, MAX_RECORDS);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
}
