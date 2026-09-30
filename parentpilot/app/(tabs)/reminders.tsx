import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";

export default function RemindersScreen() {
  return (
    <PlaceholderScreen
      title="Reminders"
      description="Gentle reminders for the little things, only when you want them."
      todo={[
        "List, create, complete and delete reminders",
        "Recurrence",
        "Native push notifications (expo-notifications) via the NotificationScheduler",
      ]}
    />
  );
}
