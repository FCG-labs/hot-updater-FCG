"use strict";

import { Platform } from "react-native";
import { HotUpdaterError } from "./error.js";
import { fetchUpdateInfo } from "./fetchUpdateInfo.js";
import { getAppVersion, getBundleId, getChannel, getFingerprintHash, getMinBundleId, updateBundle } from "./native.js";
export async function checkForUpdate(options) {
  if (__DEV__) {
    return null;
  }
  if (!["ios", "android"].includes(Platform.OS)) {
    options.onError?.(new HotUpdaterError("HotUpdater is only supported on iOS and Android"));
    return null;
  }
  const currentAppVersion = getAppVersion();
  const platform = Platform.OS;
  const currentBundleId = getBundleId();
  const minBundleId = getMinBundleId();
  const nativeChannel = getChannel();
  // Use channelOverride if provided, otherwise use native channel
  const channel = options.channelOverride ?? nativeChannel;
  if (!currentAppVersion) {
    options.onError?.(new HotUpdaterError("Failed to get app version"));
    return null;
  }
  const fingerprintHash = getFingerprintHash();
  return fetchUpdateInfo({
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
        return updateBundle({
          bundleId: updateInfo.id,
          fileUrl: updateInfo.fileUrl,
          fileHash: updateInfo?.fileHash ?? null,
          status: updateInfo.status
        });
      }
    };
  });
}
export const getUpdateSource = (baseUrl, options) => params => {
  switch (options.updateStrategy) {
    case "fingerprint":
      {
        if (!params.fingerprintHash) {
          throw new HotUpdaterError("Fingerprint hash is required");
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
//# sourceMappingURL=checkForUpdate.js.map