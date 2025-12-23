const KEY = "be_progress_v1";

export function useProgress(modules = []) {
  const stored = JSON.parse(localStorage.getItem(KEY) || "{}");

  // ⛔ Guard: modules not ready yet
  if (!Array.isArray(modules) || modules.length === 0) {
    return {
      currentModule: null,
      setCurrentModule: () => {},
    };
  }

  const currentModuleId =
    stored.currentModuleId || modules[0].id;

  const currentModule =
    modules.find((m) => m.id === currentModuleId) || modules[0];

  function setCurrentModule(id) {
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...stored, currentModuleId: id })
    );
  }

  return {
    currentModule,
    setCurrentModule,
  };
}
