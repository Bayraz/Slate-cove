import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";

export default function MemoryScreen() {
  return (
    <PlaceholderScreen
      title="Memory"
      description="Everything you've asked ParentPilot to remember will live here, organised and searchable."
      todo={[
        "Browse memories by kind (preferences, contacts, child notes, saved questions)",
        "Save memory from Ask, with confirmation (save_memory tool)",
        "Edit and delete memories",
      ]}
    />
  );
}
