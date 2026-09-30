import { loadToday } from "@/services/todayService";
import { useAsync } from "./useAsync";
import { useFamily } from "./FamilyProvider";

export function useToday() {
  const { repos, family, children } = useFamily();
  return useAsync(() => loadToday(repos, family.id, children), [family.id]);
}
