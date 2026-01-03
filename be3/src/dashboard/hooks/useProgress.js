const KEY = "be_progress_v1";

function safeReadStorage() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function useProgress(modules = []) {
  // ⛔ Guard: modules not ready
  if (!Array.isArray(modules) || modules.length === 0) {
    return {
      currentModule: null,
      setCurrentModule: () => {},
    };
  }

  const stored = safeReadStorage();

  const fallbackId = modules[0].id;

  const currentModuleId =
    stored.currentModuleId && modules.some(m => m.id === stored.currentModuleId)
      ? stored.currentModuleId
      : fallbackId;

  const currentModule =
    modules.find((m) => m.id === currentModuleId) || modules[0];

  function setCurrentModule(id) {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        ...stored,
        currentModuleId: id,
      })
    );
  }

  return {
    currentModule,
    setCurrentModule,
  };
}
