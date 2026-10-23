# Notification System

This document explains the full notification flow — from first app launch through permission request, settings toggle, export trigger, and tap-to-navigate.

---

## Overview

The notification system has four moving parts:

| Part                 | File                                        | Responsibility                                              |
| -------------------- | ------------------------------------------- | ----------------------------------------------------------- |
| Utility              | `src/utils/notifications.ts`                | Permission logic, Android channel, send function, user pref |
| App root             | `src/app/_layout.tsx`                       | Request permission on startup, listen for notification taps |
| Settings screen      | `src/app/(tabs)/setting.tsx`                | Toggle to enable / disable export notifications             |
| Preview screen       | `src/features/cv/screens/PreviewScreen.tsx` | Trigger notification after PDF / DOCX export                |
| Notifications screen | `src/features/notifications/index.tsx`      | Display export history, "View" button to open a CV          |
| Export history       | `src/utils/exportHistory.ts`                | Persist export records in AsyncStorage                      |

---

## Step 1 — First App Launch (Permission Request)

**File:** `src/app/_layout.tsx`

When the app renders for the first time, `RootLayout` runs this effect:

```ts
useEffect(() => {
  requestPermissions();
}, []);
```

`requestPermissions()` lives in `notifications.ts`:

```ts
export async function requestPermissions(): Promise<boolean> {
  const { status: current } = await Notifications.getPermissionsAsync();
  if (current === "granted") return true; // already granted → skip dialog
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}
```

**What happens on device:**

- iOS → OS shows the system permission dialog ("Allow Notifications?")
- Android 13+ → OS shows the POST_NOTIFICATIONS permission dialog
- Android < 13 → permission is granted automatically, no dialog shown
- If already granted on a subsequent launch → the check short-circuits, no dialog shown again

---

## Step 2 — Notification Handler (Foreground Display)

**File:** `src/utils/notifications.ts`

This runs once at module load time (before any component mounts):

```ts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // show banner text
    shouldShowBanner: true, // drop-down banner at top of screen
    shouldShowList: true, // appear in notification centre
    shouldPlaySound: true, // play notification_sound.wav
    shouldSetBadge: false, // do not add a badge number to the app icon
  }),
});
```

Without this handler, notifications that arrive **while the app is in the foreground** are silently swallowed. This handler tells Expo to show them anyway.

---

## Step 3 — Android Notification Channel

**File:** `src/utils/notifications.ts`

Android 8 (API 26) and above require every notification to belong to a **channel**. The channel controls sound, vibration pattern, and importance level. This is set up lazily inside `sendExportNotification`:

```ts
const EXPORT_CHANNEL_ID = "cv_export";

async function ensureExportChannel() {
  if (Platform.OS !== "android") return; // iOS has no channels
  await Notifications.setNotificationChannelAsync(EXPORT_CHANNEL_ID, {
    name: "Resume Exports",
    importance: AndroidImportance.HIGH, // shows as a heads-up notification
    sound: "notification_sound.wav",
    vibrationPattern: [0, 150, 100, 150], // wait 0ms, vibrate 150ms, pause 100ms, vibrate 150ms
    enableVibrate: true,
    showBadge: false,
  });
}
```

`setNotificationChannelAsync` is idempotent — calling it repeatedly with the same ID is safe. It only creates the channel once.

On **iOS**, sound is set directly in the notification content and channels do not exist.

---

## Step 4 — Settings Toggle (Enable / Disable)

**File:** `src/app/(tabs)/setting.tsx`

The app stores the user's notification preference in AsyncStorage under the key `@notifications_enabled`.

### Reading the preference on mount

```ts
const [notificationsOn, setNotificationsOn] = useState(true);

useEffect(() => {
  getNotificationsEnabled()
    .then(setNotificationsOn)
    .catch(() => {});
}, []);
```

`getNotificationsEnabled()` in `notifications.ts`:

```ts
export async function getNotificationsEnabled(): Promise<boolean> {
  const val = await AsyncStorage.getItem("@notifications_enabled");
  return val !== "false"; // returns true by default (key absent = first launch = ON)
}
```

### Saving the preference on toggle

```ts
async function handleNotificationToggle(value: boolean) {
  setNotificationsOn(value); // update UI immediately
  await setNotificationsEnabled(value); // persist to AsyncStorage
  if (value) requestPermissions(); // re-prompt OS if toggling back ON
}
```

The Switch in the UI is wired to these:

```tsx
<SettingItem
  title="Notifications"
  right="toggle"
  toggled={notificationsOn}
  onToggle={handleNotificationToggle}
/>
```

**Behaviour summary:**

| Toggle state | `@notifications_enabled` | `sendExportNotification`            |
| ------------ | ------------------------ | ----------------------------------- |
| ON (default) | `"true"` or absent       | fires notification                  |
| OFF          | `"false"`                | returns early, no notification sent |

> Note: Toggling OFF in the app does **not** revoke the OS-level permission. It only stops the app from scheduling new notifications. The user can still revoke OS permission separately in system settings.

---

## Step 5 — Exporting a Resume (Trigger)

**File:** `src/features/cv/screens/PreviewScreen.tsx`

After a successful PDF or DOCX export, two things are called:

```ts
async function handlePDF() {
  const result = await exportAsPDF(cv);
  if (result === "saved") {
    toast.success("PDF saved successfully.");
    await addExportRecord(cv.id, cvName, "PDF"); // save to history
    await sendExportNotification(cv.id, cvName, "PDF"); // fire notification
  }
}
```

### Inside `sendExportNotification`

```ts
export async function sendExportNotification(cvId, cvName, format) {
  // 1. Check user preference — bail out if OFF
  const enabled = await getNotificationsEnabled();
  if (!enabled) return;

  // 2. Ensure OS permission (safety net — was already requested on startup)
  const granted = await requestPermissions();
  if (!granted) return;

  // 3. Create Android channel (idempotent)
  await ensureExportChannel();

  // 4. Haptic feedback fires at the same instant the notification is sent
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // 5. Schedule the notification (trigger: null = fire immediately)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Resume exported!",
      body: `${cvName} has been saved as ${format}.`,
      sound: "notification_sound.wav",
      data: { cvId, type: "cv_export", format }, // payload carried through tap
    },
    trigger:
      Platform.OS === "android"
        ? { channelId: EXPORT_CHANNEL_ID } // Android: immediate + channel
        : null, // iOS: immediate
  });
}
```

### Export history record

`addExportRecord` in `src/utils/exportHistory.ts` writes to `@export_history_v1` in AsyncStorage:

```ts
export interface ExportRecord {
  id: string;
  cvId: string;
  cvName: string;
  format: "PDF" | "DOCX";
  timestamp: number;
}
```

Up to 30 records are kept (oldest are dropped). This is what the Notifications screen reads to show the list.

---

## Step 6 — User Taps the Notification (Navigation)

**File:** `src/app/_layout.tsx`

A listener registered in `RootLayout` handles taps on delivered notifications:

```ts
useEffect(() => {
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as Record<string, unknown>;
    if (data?.type === "cv_export") {
      router.push("/notifications"); // navigate to Notifications screen
    }
  });
  return () => sub.remove(); // clean up on unmount
}, [router]);
```

`data.type === "cv_export"` matches the payload set in step 5. This is how a tap on any export notification always lands on the same screen regardless of which CV was exported.

---

## Step 7 — Notifications Screen (View Exported CVs)

**File:** `src/features/notifications/index.tsx`

The screen loads export history every time it comes into focus:

```ts
useFocusEffect(
  useCallback(() => {
    getExportHistory()
      .then(setRecords)
      .catch(() => {});
  }, []),
);
```

Each record renders a row with a **View** button:

```ts
async function handleView(record: ExportRecord) {
  await dispatch(loadCVById(record.cvId)); // load the CV into Redux
  router.push("/cv-preview"); // open the preview screen
}
```

`loadCVById` is a Redux async thunk that reads the full `CVData` from `@cv_<id>` in AsyncStorage and puts it into the Redux store. The preview screen then reads from the store and renders the CV.

---

## Full Flow Diagram

```
App launch
    │
    ▼
_layout.tsx → requestPermissions()
    │               │
    │         OS dialog shown (first time only)
    │               │
    │         User taps Allow / Deny
    │
    ▼
User opens a CV → Preview screen
    │
    ▼
User taps "Export PDF" or "Export DOCX"
    │
    ▼
exportAsPDF() / exportAsDocx()   ← actual file saved to device
    │
    ├── addExportRecord()         ← saved to AsyncStorage (@export_history_v1)
    │
    └── sendExportNotification()
            │
            ├── getNotificationsEnabled()  → OFF? → return (nothing sent)
            ├── requestPermissions()       → not granted? → return
            ├── ensureExportChannel()      → Android only
            ├── Haptics.notificationAsync()
            └── scheduleNotificationAsync()
                        │
                        ▼
               Notification appears in system tray
               Sound plays  +  Device vibrates
                        │
                        ▼
               User taps the notification
                        │
                        ▼
               _layout.tsx listener fires
                        │
                        ▼
               router.push("/notifications")
                        │
                        ▼
               NotificationsScreen loads export history
                        │
                        ▼
               User taps "View" on a record
                        │
                        ▼
               dispatch(loadCVById(record.cvId))
                        │
                        ▼
               router.push("/cv-preview")   ← CV opens in preview
```

---

## Key Files Reference

```
src/
├── app/
│   ├── _layout.tsx                          Permission request + tap listener
│   └── (tabs)/setting.tsx                   Notification toggle UI
├── utils/
│   ├── notifications.ts                     Core utility (handler, channel, send, pref)
│   └── exportHistory.ts                     AsyncStorage CRUD for export records
└── features/
    ├── cv/screens/PreviewScreen.tsx         Calls sendExportNotification after export
    └── notifications/index.tsx             Notifications screen with View button
```

---

## AsyncStorage Keys

| Key                      | Type                  | Purpose                                            |
| ------------------------ | --------------------- | -------------------------------------------------- |
| `@notifications_enabled` | `"true"` / `"false"`  | User's on/off preference from Settings             |
| `@export_history_v1`     | `ExportRecord[]` JSON | List of past exports shown on Notifications screen |
