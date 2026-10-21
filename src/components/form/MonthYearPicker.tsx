import { ChevronDown } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from "react-native";
import { colors } from "@/styles/colors";
import { AndroidNavSpacer } from "../core";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const THIS_YEAR = new Date().getFullYear();
const YEARS: string[] = Array.from({ length: THIS_YEAR - 1959 + 2 }, (_, i) =>
  String(THIS_YEAR + 1 - i),
);

function parse(value: string): { month: string; year: string } | "present" | null {
  if (value === "Present") return "present";
  const parts = value.trim().split(" ");
  if (parts.length === 2 && MONTHS.includes(parts[0]) && /^\d{4}$/.test(parts[1])) {
    return { month: parts[0], year: parts[1] };
  }
  return null;
}

interface Props {
  label: string;
  value: string;
  onChange: (val: string) => void;
  allowPresent?: boolean;
  placeholder?: string;
}

export default function MonthYearPicker({
  label,
  value,
  onChange,
  allowPresent,
  placeholder = "Select",
}: Props) {
  const [open, setOpen] = useState(false);

  const defaultMonth = MONTHS[new Date().getMonth()];
  const defaultYear = String(THIS_YEAR);

  const [selMonth, setSelMonth] = useState(defaultMonth);
  const [selYear, setSelYear] = useState(defaultYear);
  const [isPresent, setIsPresent] = useState(false);

  const monthRef = useRef<FlatList>(null);
  const yearRef = useRef<FlatList>(null);

  function openPicker() {
    const p = parse(value);
    if (p === "present") {
      setIsPresent(true);
      setSelMonth(defaultMonth);
      setSelYear(defaultYear);
    } else if (p) {
      setIsPresent(false);
      setSelMonth(p.month);
      setSelYear(p.year);
      // scroll to selection
      const mi = MONTHS.indexOf(p.month);
      const yi = YEARS.indexOf(p.year);
      setTimeout(() => {
        monthRef.current?.scrollToIndex({ index: mi, animated: false, viewPosition: 0.4 });
        yearRef.current?.scrollToIndex({ index: yi, animated: false, viewPosition: 0.4 });
      }, 50);
    } else {
      setIsPresent(false);
      setSelMonth(defaultMonth);
      setSelYear(defaultYear);
    }
    setOpen(true);
  }

  function handleConfirm() {
    onChange(isPresent ? "Present" : `${selMonth} ${selYear}`);
    setOpen(false);
  }

  const displayValue = value || "";
  const hasValue = Boolean(value);

  const renderMonth: ListRenderItem<string> = ({ item }) => {
    const active = item === selMonth;
    return (
      <Pressable
        style={[ss.item, active && { backgroundColor: colors.primary + "18" }]}
        onPress={() => setSelMonth(item)}
      >
        <Text style={[ss.itemText, active && ss.itemActive]}>{item}</Text>
      </Pressable>
    );
  };

  const renderYear: ListRenderItem<string> = ({ item }) => {
    const active = item === selYear;
    return (
      <Pressable
        style={[ss.item, active && { backgroundColor: colors.primary + "18" }]}
        onPress={() => setSelYear(item)}
      >
        <Text style={[ss.itemText, active && ss.itemActive]}>{item}</Text>
      </Pressable>
    );
  };

  return (
    <>
      <View style={{ gap: 6 }}>
        <Text className="label-text">{label}</Text>
        <Pressable style={ss.trigger} onPress={openPicker}>
          <Text style={[ss.triggerText, !hasValue && ss.placeholder]}>
            {hasValue ? displayValue : placeholder}
          </Text>
          <ChevronDown size={16} color={colors.mutedForeground} />
        </Pressable>
      </View>

      <Modal transparent animationType="slide" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={ss.backdrop} onPress={() => setOpen(false)} />

        <View style={ss.sheet}>
          <View style={ss.handle} />
          <Text style={ss.sheetTitle}>{label}</Text>

          {allowPresent && (
            <Pressable
              style={[ss.presentBtn, isPresent && { backgroundColor: colors.primary }]}
              onPress={() => setIsPresent((v) => !v)}
            >
              <Text style={[ss.presentText, isPresent && { color: "#fff" }]}>
                Present / Current
              </Text>
            </Pressable>
          )}

          {!isPresent && (
            <View style={ss.columns}>
              <View style={ss.colWrap}>
                <Text style={ss.colLabel}>Month</Text>
                <FlatList
                  ref={monthRef}
                  data={MONTHS}
                  keyExtractor={(m) => m}
                  renderItem={renderMonth}
                  showsVerticalScrollIndicator={false}
                  style={ss.col}
                  onScrollToIndexFailed={() => {}}
                />
              </View>
              <View style={[ss.colDivider]} />
              <View style={ss.colWrap}>
                <Text style={ss.colLabel}>Year</Text>
                <FlatList
                  ref={yearRef}
                  data={YEARS}
                  keyExtractor={(y) => y}
                  renderItem={renderYear}
                  showsVerticalScrollIndicator={false}
                  style={ss.col}
                  onScrollToIndexFailed={() => {}}
                />
              </View>
            </View>
          )}

          {isPresent && (
            <View style={ss.presentConfirm}>
              <Text style={{ color: colors.mutedForeground, fontSize: 14 }}>
                Will display as &ldquo;Present&rdquo;
              </Text>
            </View>
          )}

          <View style={ss.btnRow}>
            <Pressable style={[ss.btn, ss.cancelBtn]} onPress={() => setOpen(false)}>
              <Text style={ss.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[ss.btn, ss.confirmBtn]} onPress={handleConfirm}>
              <Text style={ss.confirmText}>Confirm</Text>
            </Pressable>
          </View>
          <AndroidNavSpacer />
        </View>
      </Modal>
    </>
  );
}

const ss = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  triggerText: {
    fontSize: 16,
    color: colors.foreground,
  },
  placeholder: {
    color: colors.subtleForeground,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingBottom: 36,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: colors.foreground,
    marginBottom: 16,
    textAlign: "center",
  },
  presentBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  presentText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: colors.primary,
  },
  columns: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  colWrap: {
    flex: 1,
  },
  colLabel: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: colors.mutedForeground,
    textAlign: "center",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  col: {
    height: 200,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  colDivider: {
    width: 1,
    backgroundColor: colors.border,
    alignSelf: "stretch",
    marginVertical: 24,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 15,
    color: colors.foreground,
    textAlign: "center",
  },
  itemActive: {
    color: colors.primary,
    fontFamily: "Poppins-SemiBold",
  },
  presentConfirm: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: colors.secondary,
  },
  cancelText: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: colors.foreground,
  },
  confirmBtn: {
    backgroundColor: colors.primary,
  },
  confirmText: {
    fontSize: 15,
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },
});
