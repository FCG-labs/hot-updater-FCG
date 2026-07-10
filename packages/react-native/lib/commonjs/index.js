"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  HotUpdater: true,
  getUpdateSource: true
};
exports.HotUpdater = void 0;
Object.defineProperty(exports, "getUpdateSource", {
  enumerable: true,
  get: function () {
    return _checkForUpdate.getUpdateSource;
  }
});
var _checkForUpdate = require("./checkForUpdate.js");
var _native = require("./native.js");
var _runUpdateProcess = require("./runUpdateProcess.js");
var _store = require("./store.js");
Object.keys(_store).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _store[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _store[key];
    }
  });
});
var _wrap = require("./wrap.js");
(0, _native.addListener)("onProgress", ({
  progress
}) => {
  _store.hotUpdaterStore.setState({
    progress
  });
});
const HotUpdater = exports.HotUpdater = {
  /**
   * `HotUpdater.wrap` checks for updates at the entry point, and if there is a bundle to update, it downloads the bundle and applies the update strategy.
   *
   * @param {object} options - Configuration options
   * @param {string} options.source - Update server URL
   * @param {object} [options.requestHeaders] - Request headers
   * @param {React.ComponentType} [options.fallbackComponent] - Component to display during updates
   * @param {boolean} [options.reloadOnForceUpdate=true] - Whether to automatically reload the app on force updates
   * @param {Function} [options.onUpdateProcessCompleted] - Callback after update process completes
   * @param {Function} [options.onProgress] - Callback to track bundle download progress
   * @returns {Function} Higher-order component that wraps the app component
   *
   * @example
   * ```tsx
   * export default HotUpdater.wrap({
   *   source: "<your-update-server-url>",
   *   requestHeaders: {
   *     "Authorization": "Bearer <your-access-token>",
   *   },
   * })(App);
   * ```
   */
  wrap: _wrap.wrap,
  /**
   * Reloads the app.
   */
  reload: _native.reload,
  /**
   * Returns whether an update has finished downloading in this app session.
   *
   * When it returns true, calling `HotUpdater.reload()` (or restarting the app)
   * will apply the downloaded update bundle.
   *
   * - Derived from `progress` reaching 1.0
   * - Resets to false when a new download starts (progress < 1)
   *
   * @returns {boolean} True if a downloaded update is ready to apply
   * @example
   * ```ts
   * if (HotUpdater.isUpdateDownloaded()) {
   *   await HotUpdater.reload();
   * }
   * ```
   */
  isUpdateDownloaded: () => _store.hotUpdaterStore.getSnapshot().isUpdateDownloaded,
  /**
   * Fetches the current app version.
   */
  getAppVersion: _native.getAppVersion,
  /**
   * Fetches the current bundle ID of the app.
   */
  getBundleId: _native.getBundleId,
  /**
   * Retrieves the initial bundle ID based on the build time of the native app.
   */
  getMinBundleId: _native.getMinBundleId,
  /**
   * Fetches the current channel of the app.
   *
   * If no channel is specified, the app is assigned to the 'production' channel.
   *
   * @returns {string} The current release channel of the app
   * @default "production"
   * @example
   * ```ts
   * const channel = HotUpdater.getChannel();
   * console.log(`Current channel: ${channel}`);
   * ```
   */
  getChannel: _native.getChannel,
  /**
   * Adds a listener to HotUpdater events.
   *
   * @param {keyof HotUpdaterEvent} eventName - The name of the event to listen for
   * @param {(event: HotUpdaterEvent[T]) => void} listener - The callback function to handle the event
   * @returns {() => void} A cleanup function that removes the event listener
   *
   * @example
   * ```ts
   * const unsubscribe = HotUpdater.addListener("onProgress", ({ progress }) => {
   *   console.log(`Update progress: ${progress * 100}%`);
   * });
   *
   * // Unsubscribe when no longer needed
   * unsubscribe();
   * ```
   */
  addListener: _native.addListener,
  /**
   * Manually checks for updates.
   *
   * @param {Object} config - Update check configuration
   * @param {string} config.source - Update server URL
   * @param {Record<string, string>} [config.requestHeaders] - Request headers
   *
   * @returns {Promise<UpdateInfo | null>} Update information or null if up to date
   *
   * @example
   * ```ts
   * const updateInfo = await HotUpdater.checkForUpdate({
   *   source: "<your-update-server-url>",
   *   requestHeaders: {
   *     Authorization: "Bearer <your-access-token>",
   *   },
   * });
   *
   * if (!updateInfo) {
   *   console.log("App is up to date");
   *   return;
   * }
   *
   * await HotUpdater.updateBundle(updateInfo.id, updateInfo.fileUrl);
   * if (updateInfo.shouldForceUpdate) {
   *   await HotUpdater.reload();
   * }
   * ```
   */
  checkForUpdate: _checkForUpdate.checkForUpdate,
  /**
   * Manually checks and applies updates for the application.
   *
   * @param {RunUpdateProcessConfig} config - Update process configuration
   * @param {string} config.source - Update server URL
   * @param {Record<string, string>} [config.requestHeaders] - Request headers
   * @param {boolean} [config.reloadOnForceUpdate=false] - Whether to automatically reload on force update
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
  runUpdateProcess: _runUpdateProcess.runUpdateProcess,
  /**
   * Updates the bundle of the app.
   *
   * @param {UpdateBundleParams} params - Parameters object required for bundle update
   * @param {string} params.bundleId - The bundle ID of the app
   * @param {string|null} params.fileUrl - The URL of the zip file
   *
   * @returns {Promise<boolean>} Whether the update was successful
   *
   * @example
   * ```ts
   * const updateInfo = await HotUpdater.checkForUpdate({
   *   source: "<your-update-server-url>",
   *   requestHeaders: {
   *     Authorization: "Bearer <your-access-token>",
   *   },
   * });
   *
   * if (!updateInfo) {
   *   return {
   *     status: "UP_TO_DATE",
   *   };
   * }
   *
   * await HotUpdater.updateBundle({
   *   bundleId: updateInfo.id,
   *   fileUrl: updateInfo.fileUrl
   * });
   * if (updateInfo.shouldForceUpdate) {
   *   await HotUpdater.reload();
   * }
   * ```
   */
  updateBundle: _native.updateBundle,
  /**
   * Fetches the fingerprint of the app.
   *
   * @returns {string} The fingerprint of the app
   *
   * @example
   * ```ts
   * const fingerprint = HotUpdater.getFingerprintHash();
   * console.log(`Fingerprint: ${fingerprint}`);
   * ```
   */
  getFingerprintHash: _native.getFingerprintHash
};
//# sourceMappingURL=index.js.map