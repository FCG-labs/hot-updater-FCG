"use strict";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { checkForUpdate } from "./checkForUpdate.js";
import { useEventCallback } from "./hooks/useEventCallback.js";
import { getBundleId, reload } from "./native.js";
import { useHotUpdaterStore } from "./store.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function wrap(options) {
  const {
    reloadOnForceUpdate = true,
    ...restOptions
  } = options;
  return WrappedComponent => {
    const HotUpdaterHOC = props => {
      const progress = useHotUpdaterStore(state => state.progress);
      const [message, setMessage] = useState(null);
      const [updateStatus, setUpdateStatus] = useState("CHECK_FOR_UPDATE");
      const initHotUpdater = useEventCallback(async () => {
        try {
          setUpdateStatus("CHECK_FOR_UPDATE");
          const updateInfo = await checkForUpdate({
            source: restOptions.source,
            requestHeaders: restOptions.requestHeaders,
            onError: restOptions.onError,
            channelOverride: restOptions.channelOverride
          });
          setMessage(updateInfo?.message ?? null);
          if (!updateInfo) {
            restOptions.onUpdateProcessCompleted?.({
              status: "UP_TO_DATE",
              shouldForceUpdate: false,
              message: null,
              id: getBundleId()
            });
            setUpdateStatus("UPDATE_PROCESS_COMPLETED");
            return;
          }
          if (updateInfo.shouldForceUpdate === false) {
            void updateInfo.updateBundle().catch(error => {
              restOptions.onError?.(error);
            });
            restOptions.onUpdateProcessCompleted?.({
              id: updateInfo.id,
              status: updateInfo.status,
              shouldForceUpdate: updateInfo.shouldForceUpdate,
              message: updateInfo.message
            });
            setUpdateStatus("UPDATE_PROCESS_COMPLETED");
            return;
          }
          // Force Update Scenario
          setUpdateStatus("UPDATING");
          const isSuccess = await updateInfo.updateBundle();
          if (!isSuccess) {
            throw new Error("New update was found but failed to download the bundle.");
          }
          if (reloadOnForceUpdate) {
            await reload();
          }
          restOptions.onUpdateProcessCompleted?.({
            id: updateInfo.id,
            status: updateInfo.status,
            shouldForceUpdate: updateInfo.shouldForceUpdate,
            message: updateInfo.message
          });
          setUpdateStatus("UPDATE_PROCESS_COMPLETED");
        } catch (error) {
          restOptions.onError?.(error);
          setUpdateStatus("UPDATE_PROCESS_COMPLETED");
        }
      });
      useEffect(() => {
        restOptions.onProgress?.(progress);
      }, [progress]);
      useLayoutEffect(() => {
        initHotUpdater();
      }, []);
      if (restOptions.fallbackComponent && updateStatus !== "UPDATE_PROCESS_COMPLETED") {
        const Fallback = restOptions.fallbackComponent;
        return /*#__PURE__*/_jsx(Fallback, {
          progress: progress,
          status: updateStatus,
          message: message
        });
      }
      return /*#__PURE__*/_jsx(WrappedComponent, {
        ...props
      });
    };
    return HotUpdaterHOC;
  };
}
//# sourceMappingURL=wrap.js.map