import { PlaceholderScreen } from "@/components/ui/PlaceholderScreen";

export default function CommunityScreen() {
  return (
    <PlaceholderScreen
      title="Community"
      description="A small, supportive space, structured by topic rather than an endless feed."
      todo={[
        "Topic-based posts and comments (data model exists in src/domain/models.ts)",
        "Save posts, report content, block users",
        "Display names only; moderation tooling before launch",
      ]}
    />
  );
}
