import { colors } from "@/styles/colors";
import { Clock, FileText, Upload } from "lucide-react-native";
import { Text, View } from "react-native";

interface StatsRowProps {
  totalCVs: number;
  totalExports: number;
  lastEditTimestamp: number | null;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  borderRight?: boolean;
}

function StatCard({ icon, value, label, borderRight = false }: StatCardProps) {
  return (
    <View className={`flex-1 items-center py-3 ${borderRight ? "border-r border-border" : ""}`}>
      <View
        style={{ backgroundColor: colors.primary + "15" }}
        className="mb-2 h-9 w-9 items-center justify-center rounded-xl"
      >
        {icon}
      </View>
      <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16, color: colors.foreground }}>
        {value}
      </Text>
      <Text style={{ fontFamily: "Poppins-Regular", fontSize: 11, color: colors.mutedForeground }}>
        {label}
      </Text>
    </View>
  );
}

export default function StatsRow({ totalCVs, totalExports, lastEditTimestamp }: StatsRowProps) {
  return (
    <View className="flex-row overflow-hidden rounded-2xl bg-white">
      <StatCard
        icon={<FileText size={17} color={colors.primary} strokeWidth={1.8} />}
        value={String(totalCVs)}
        label="Resumes"
        borderRight
      />
      <StatCard
        icon={<Upload size={17} color={colors.primary} strokeWidth={1.8} />}
        value={String(totalExports)}
        label="Exports"
        borderRight
      />
      <StatCard
        icon={<Clock size={17} color={colors.primary} strokeWidth={1.8} />}
        value={lastEditTimestamp ? timeAgo(lastEditTimestamp) : "—"}
        label="Last Edit"
      />
    </View>
  );
}
