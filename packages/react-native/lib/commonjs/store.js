"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHotUpdaterStore = exports.hotUpdaterStore = void 0;
var _withSelector = _interopRequireDefault(require("use-sync-external-store/shim/with-selector"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const {
  useSyncExternalStoreWithSelector
} = _withSelector.default;
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
const hotUpdaterStore = exports.hotUpdaterStore = createHotUpdaterStore();
const useHotUpdaterStore = (selector = snapshot => snapshot) => {
  return useSyncExternalStoreWithSelector(hotUpdaterStore.subscribe, hotUpdaterStore.getSnapshot, hotUpdaterStore.getSnapshot, selector);
};
exports.useHotUpdaterStore = useHotUpdaterStore;
//# sourceMappingURL=store.js.map