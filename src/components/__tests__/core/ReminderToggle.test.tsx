import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Platform } from "react-native";
import { fireEvent, render, screen, userEvent, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { ReminderToggle } from "@/components/core";
import {
  cancelWeeklyReminder,
  scheduleWeeklyReminder,
  requestPermissions,
} from "@/utils/notifications";

jest.mock("../../../utils/notifications", () => ({
  requestPermissions: jest.fn(),
  scheduleWeeklyReminder: jest.fn(),
  cancelWeeklyReminder: jest.fn(),
}));

jest.mock("expo-notifications", () => ({
  scheduleNotificationAsync: jest.fn(),
}));

const REMINDERS_KEY = "remindersEnabled";

const mockAlert = jest.fn();
global.alert = mockAlert;

const getSwitch = () => screen.getByRole("switch");

/** Renders the component and waits for the saved setting to be read. */
const renderLoaded = async (saved: string | null = null) => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce(saved);
  await render(<ReminderToggle />);
  await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalledWith(REMINDERS_KEY));
};

let restorePlatform: (() => void) | undefined;
const setPlatform = (os: typeof Platform.OS) => {
  restorePlatform = jest.replaceProperty(Platform, "OS", os).restore;
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(requestPermissions).mockResolvedValue(true);
  jest.mocked(scheduleWeeklyReminder).mockResolvedValue(undefined);
  jest.mocked(cancelWeeklyReminder).mockResolvedValue(undefined);
  jest.mocked(Notifications.scheduleNotificationAsync).mockResolvedValue("notification-id");
});

afterEach(() => {
  restorePlatform?.();
  restorePlatform = undefined;
});

describe("ReminderToggle", () => {
  it("renders the label and the notification check button", async () => {
    await renderLoaded();

    expect(screen.getByText("Meal Reminders")).toBeOnTheScreen();
    expect(screen.getByText("Notification Check")).toBeOnTheScreen();
  });

  describe("loading the saved setting", () => {
    it("is off when nothing has been saved", async () => {
      await renderLoaded(null);

      expect(getSwitch()).not.toBeChecked();
    });

    it("is on when reminders were saved as enabled", async () => {
      await renderLoaded("true");

      await waitFor(() => expect(getSwitch()).toBeChecked());
    });

    it("is off when reminders were saved as disabled", async () => {
      await renderLoaded("false");

      expect(getSwitch()).not.toBeChecked();
    });
  });

  describe("turning reminders on", () => {
    it("schedules the weekly reminder and saves the setting when permission is granted", async () => {
      await renderLoaded();

      await fireEvent(getSwitch(), "valueChange", true);

      await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenCalledWith(REMINDERS_KEY, "true"));
      expect(requestPermissions).toHaveBeenCalledTimes(1);
      expect(scheduleWeeklyReminder).toHaveBeenCalledTimes(1);
      expect(getSwitch()).toBeChecked();
    });

    it("stays off and saves nothing when permission is denied", async () => {
      jest.mocked(requestPermissions).mockResolvedValue(false);
      await renderLoaded();

      await fireEvent(getSwitch(), "valueChange", true);

      await waitFor(() => expect(requestPermissions).toHaveBeenCalledTimes(1));
      expect(scheduleWeeklyReminder).not.toHaveBeenCalled();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(getSwitch()).not.toBeChecked();
    });
  });

  describe("turning reminders off", () => {
    it("cancels the weekly reminder and saves the setting", async () => {
      await renderLoaded("true");
      await waitFor(() => expect(getSwitch()).toBeChecked());

      await fireEvent(getSwitch(), "valueChange", false);

      await waitFor(() =>
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(REMINDERS_KEY, "false"),
      );
      expect(cancelWeeklyReminder).toHaveBeenCalledTimes(1);
      expect(requestPermissions).not.toHaveBeenCalled();
      expect(getSwitch()).not.toBeChecked();
    });
  });

  describe("notification check", () => {
    it("sends an instant notification when permission is granted", async () => {
      const user = userEvent.setup();
      await renderLoaded();

      await user.press(screen.getByText("Notification Check"));

      await waitFor(() => expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1));
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: expect.objectContaining({
          title: "MacroZone Alert 🔔",
          body: "Here is your instant notification!",
          data: { screen: "/profile" },
        }),
        trigger: null,
      });
      expect(mockAlert).not.toHaveBeenCalled();
    });

    it("shows an alert and sends nothing when permission is denied", async () => {
      const user = userEvent.setup();
      jest.mocked(requestPermissions).mockResolvedValue(false);
      await renderLoaded();

      await user.press(screen.getByText("Notification Check"));

      await waitFor(() =>
        expect(mockAlert).toHaveBeenCalledWith("Please enable notifications in settings!"),
      );
      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it("uses the custom sound on iOS", async () => {
      setPlatform("ios");
      const user = userEvent.setup();
      await renderLoaded();

      await user.press(screen.getByText("Notification Check"));

      await waitFor(() =>
        expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({ sound: "notification_sound.wav" }),
          }),
        ),
      );
    });

    it("uses no custom sound on Android", async () => {
      setPlatform("android");
      const user = userEvent.setup();
      await renderLoaded();

      await user.press(screen.getByText("Notification Check"));

      await waitFor(() => expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledTimes(1));
      const [request] = jest.mocked(Notifications.scheduleNotificationAsync).mock.calls[0]!;
      expect(request.content.sound).toBeUndefined();
    });
  });
});
