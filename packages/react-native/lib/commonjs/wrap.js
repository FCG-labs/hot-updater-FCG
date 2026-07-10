"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = wrap;
var _react = _interopRequireWildcard(require("react"));
var _checkForUpdate = require("./checkForUpdate.js");
var _useEventCallback = require("./hooks/useEventCallback.js");
var _native = require("./native.js");
var _store = require("./store.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function wrap(options) {
  const {
    reloadOnForceUpdate = true,
    ...restOptions
  } = options;
  return WrappedComponent => {
    const HotUpdaterHOC = props => {
      const progress = (0, _store.useHotUpdaterStore)(state => state.progress);
      const [message, setMessage] = (0, _react.useState)(null);
      const [updateStatus, setUpdateStatus] = (0, _react.useState)("CHECK_FOR_UPDATE");
      const initHotUpdater = (0, _useEventCallback.useEventCallback)(async () => {
        try {
          setUpdateStatus("CHECK_FOR_UPDATE");
          const updateInfo = await (0, _checkForUpdate.checkForUpdate)({
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
              id: (0, _native.getBundleId)()
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
            await (0, _native.reload)();
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
      (0, _react.useEffect)(() => {
        restOptions.onProgress?.(progress);
      }, [progress]);
      (0, _react.useLayoutEffect)(() => {
        initHotUpdater();
      }, []);
      if (restOptions.fallbackComponent && updateStatus !== "UPDATE_PROCESS_COMPLETED") {
        const Fallback = restOptions.fallbackComponent;
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(Fallback, {
          progress: progress,
          status: updateStatus,
          message: message
        });
      }
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(WrappedComponent, {
        ...props
      });
    };
    return HotUpdaterHOC;
  };
}
//# sourceMappingURL=wrap.js.map