"use strict";

import { useCallback, useLayoutEffect, useRef } from "react";
export function useEventCallback(fn) {
  const callbackRef = useRef(() => {
    throw new Error("Cannot call an event handler while rendering.");
  });
  useLayoutEffect(() => {
    callbackRef.current = fn;
  }, [fn]);
  return useCallback((...args) => callbackRef.current?.(...args), [callbackRef]);
}
//# sourceMappingURL=useEventCallback.js.map