"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkForUpdate = checkForUpdate;
exports.getUpdateSource = void 0;
var _reactNative = require("react-native");
var _error = require("./error.js");
var _fetchUpdateInfo = require("./fetchUpdateInfo.js");
var _native = require("./native.js");
async function checkForUpdate(options) {
  if (__DEV__) {
    return null;
  }
  if (!["ios", "android"].includes(_reactNative.Platform.OS)) {
    options.onError?.(new _error.HotUpdaterError("HotUpdater is only supported on iOS and Android"));
    return null;
  }
  const currentAppVersion = (0, _native.getAppVersion)();
  const platform = _reactNative.Platform.OS;
  const currentBundleId = (0, _native.getBundleId)();
  const minBundleId = (0, _native.getMinBundleId)();
  const nativeChannel = (0, _native.getChannel)();
  // Use channelOverride if provided, otherwise use native channel
  const channel = options.channelOverride ?? nativeChannel;
  if (!currentAppVersion) {
    options.onError?.(new _error.HotUpdaterError("Failed to get app version"));
    return null;
  }
  const fingerprintHash = (0, _native.getFingerprintHash)();
  return (0, _fetchUpdateInfo.fetchUpdateInfo)({
    source: options.source,
    params: {
      bundleId: currentBundleId,
      appVersion: currentAppVersion,
      platform,
      minBundleId,
      channel,
      fingerprintHash
    },
    requestHeaders: options.requestHeaders,
    onError: options.onError,
    requestTimeout: options.requestTimeout
  }).then(updateInfo => {
    if (!updateInfo) {
      return null;
    }
    return {
      ...updateInfo,
      updateBundle: async () => {
        return (0, _native.updateBundle)({
          bundleId: updateInfo.id,
          fileUrl: updateInfo.fileUrl,
          fileHash: updateInfo?.fileHash ?? null,
          status: updateInfo.status
        });
      }
    };
  });
}
const getUpdateSource = (baseUrl, options) => params => {
  switch (options.updateStrategy) {
    case "fingerprint":
      {
        if (!params.fingerprintHash) {
          throw new _error.HotUpdaterError("Fingerprint hash is required");
        }
        return `${baseUrl}/fingerprint/${params.platform}/${params.fingerprintHash}/${params.channel}/${params.minBundleId}/${params.bundleId}`;
      }
    case "appVersion":
      {
        return `${baseUrl}/app-version/${params.platform}/${params.appVersion}/${params.channel}/${params.minBundleId}/${params.bundleId}`;
      }
    default:
      return baseUrl;
  }
};
exports.getUpdateSource = getUpdateSource;
//# sourceMappingURL=checkForUpdate.js.map