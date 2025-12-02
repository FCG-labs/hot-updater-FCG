"use strict";

import useSyncExternalStoreExports from "use-sync-external-store/shim/with-selector";
const {
  useSyncExternalStoreWithSelector
} = useSyncExternalStoreExports;
const createHotUpdaterStore = () => {
  let state = {
    progress: 0,
    isUpdateDownloaded: false
  };
  const getSnapshot = () => {
    return state;
  };
  const listeners = new Set();
  const emitChange = () => {
    for (const listener of listeners) {
      listener();
    }
  };
  const setState = newState => {
    // Merge first, then normalize derived fields
    const nextState = {
      ...state,
      ...newState
    };

    // Derive `isUpdateDownloaded` from `progress` if provided.
    // If `progress` is not provided but `isUpdateDownloaded` is,
    // honor the explicit value.
    if ("progress" in newState && typeof newState.progress === "number") {
      nextState.isUpdateDownloaded = newState.progress >= 1;
    } else if ("isUpdateDownloaded" in newState && typeof newState.isUpdateDownloaded === "boolean") {
      nextState.isUpdateDownloaded = newState.isUpdateDownloaded;
    }
    state = nextState;
    emitChange();
  };
  const subscribe = listener => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  return {
    getSnapshot,
    setState,
    subscribe
  };
};
export const hotUpdaterStore = createHotUpdaterStore();
export const useHotUpdaterStore = (selector = snapshot => snapshot) => {
  return useSyncExternalStoreWithSelector(hotUpdaterStore.subscribe, hotUpdaterStore.getSnapshot, hotUpdaterStore.getSnapshot, selector);
};
//# sourceMappingURL=store.js.map