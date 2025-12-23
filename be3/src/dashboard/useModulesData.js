import { useModules } from "./hooks/useModules";

export function useModulesData() {
  const modules = useModules();

  return {
    modules: modules || [],        // 🔑 always an array for UI
    loading: modules === null,     // 🔑 true only while loading
  };
}
