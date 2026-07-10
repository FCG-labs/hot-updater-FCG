"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEventCallback = useEventCallback;
var _react = require("react");
function useEventCallback(fn) {
  const callbackRef = (0, _react.useRef)(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  (0, _react.useLayoutEffect)(() => {
    callbackRef.current = fn;
  }, [fn]);
  return (0, _react.useCallback)((...args) => callbackRef.current?.(...args), [callbackRef]);
}
//# sourceMappingURL=useEventCallback.js.map