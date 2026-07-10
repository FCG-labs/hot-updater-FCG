"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runUpdateProcess = void 0;
var _checkForUpdate = require("./checkForUpdate.js");
var _native = require("./native.js");
/**
 * Manually checks and applies updates for the application.
 *
 * @param {RunUpdateProcessConfig} config - Update process configuration
 * @param {string} config.source - Update server URL
 * @param {Record<string, string>} [config.requestHeaders] - Request headers
 * @param {boolean} [config.reloadOnForceUpdate=true] - Whether to automatically reload on force update
 *
 * @example
 * ```ts
 * // Auto reload on force update
 * const result = await HotUpdater.runUpdateProcess({
 *   source: "<your-update-server-url>",
 *   requestHeaders: {
 *     // Add necessary headers
 *   },
 *   reloadOnForceUpdate: true
 * });
 *
 * // Manually handle reload on force update
 * const result = await HotUpdater.runUpdateProcess({
 *   source: "<your-update-server-url>",
 *   reloadOnForceUpdate: false
 * });
 *
 * if(result.status !== "UP_TO_DATE" && result.shouldForceUpdate) {
 *   await HotUpdater.reload();
 * }
 * ```
 *
 * @returns {Promise<RunUpdateProcessResponse>} The result of the update process
 */
const runUpdateProcess = async ({
  reloadOnForceUpdate = true,
  ...checkForUpdateOptions
}) => {
  const updateInfo = await (0, _checkForUpdate.checkForUpdate)(checkForUpdateOptions);
  if (!updateInfo) {
    return {
      status: "UP_TO_DATE",
      shouldForceUpdate: false,
      message: null,
      id: (0, _native.getBundleId)()
    };
  }
  const isUpdated = await updateInfo.updateBundle();
  if (isUpdated && updateInfo.shouldForceUpdate && reloadOnForceUpdate) {
    await (0, _native.reload)();
  }
  if (!isUpdated) {
    throw new Error("New update was found but failed to download the bundle.");
  }
  return {
    status: updateInfo.status,
    shouldForceUpdate: updateInfo.shouldForceUpdate,
    id: updateInfo.id,
    message: updateInfo.message
  };
};
exports.runUpdateProcess = runUpdateProcess;
//# sourceMappingURL=runUpdateProcess.js.map