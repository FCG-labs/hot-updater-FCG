"use strict";

import { NativeEventEmitter } from "react-native";
import HotUpdaterNative from "./specs/NativeHotUpdater.js";
const NIL_UUID = "00000000-0000-0000-0000-000000000000";
export const HotUpdaterConstants = {
  HOT_UPDATER_BUNDLE_ID: __HOT_UPDATER_BUNDLE_ID || NIL_UUID
};
export const addListener = (eventName, listener) => {
  const eventEmitter = new NativeEventEmitter(HotUpdaterNative);
  const subscription = eventEmitter.addListener(eventName, listener);
  return () => {
    subscription.remove();
  };
};
// In-flight update deduplication by bundleId (session-scoped).
const inflightUpdates = new Map();
// Tracks the last successfully installed bundleId for this session.
let lastInstalledBundleId = null;

/**
 * Downloads files and applies them to the app.
 *
 * @param {UpdateParams} params - Parameters object required for bundle update
 * @returns {Promise<boolean>} Resolves with true if download was successful, otherwise rejects with an error.
 */

/**
 * @deprecated Use updateBundle(params: UpdateBundleParamsWithStatus) instead
 */

export async function updateBundle(paramsOrBundleId, fileUrl) {
  const updateBundleId = typeof paramsOrBundleId === "string" ? paramsOrBundleId : paramsOrBundleId.bundleId;
  const status = typeof paramsOrBundleId === "string" ? "UPDATE" : paramsOrBundleId.status;

  // If we have already installed this bundle in this session, skip re-download.
  if (status === "UPDATE" && lastInstalledBundleId === updateBundleId) {
    return true;
  }
  const currentBundleId = getBundleId();

  // updateBundleId <= currentBundleId
  if (status === "UPDATE" && updateBundleId.localeCompare(currentBundleId) <= 0) {
    throw new Error("Update bundle id is the same as the current bundle id. Preventing infinite update loop.");
  }

  // In-flight guard: return the same promise if the same bundle is already updating.
  const existing = inflightUpdates.get(updateBundleId);
  if (existing) return existing;
  const targetFileUrl = typeof paramsOrBundleId === "string" ? fileUrl ?? null : paramsOrBundleId.fileUrl;
  const targetFileHash = typeof paramsOrBundleId === "string" ? undefined : paramsOrBundleId.fileHash;
  const promise = (async () => {
    try {
      const ok = await HotUpdaterNative.updateBundle({
        bundleId: updateBundleId,
        fileUrl: targetFileUrl,
        fileHash: targetFileHash ?? null
      });
      if (ok) {
        lastInstalledBundleId = updateBundleId;
      }
      return ok;
    } finally {
      inflightUpdates.delete(updateBundleId);
    }
  })();
  inflightUpdates.set(updateBundleId, promise);
  return promise;
}

/**
 * Fetches the current app version.
 */
export const getAppVersion = () => {
  const constants = HotUpdaterNative.getConstants();
  return constants?.APP_VERSION ?? null;
};

/**
 * Reloads the app.
 */
export const reload = async () => {
  await HotUpdaterNative.reload();
};

/**
 * Fetches the minimum bundle id, which represents the initial bundle of the app
 * since it is created at build time.
 *
 * @returns {string} Resolves with the minimum bundle id or null if not available.
 */
export const getMinBundleId = () => {
  const constants = HotUpdaterNative.getConstants();
  return constants.MIN_BUNDLE_ID;
};

/**
 * Fetches the current bundle version id.
 *
 * @async
 * @returns {Promise<string>} Resolves with the current version id or null if not available.
 */
export const getBundleId = () => {
  return HotUpdaterConstants.HOT_UPDATER_BUNDLE_ID === NIL_UUID ? getMinBundleId() : HotUpdaterConstants.HOT_UPDATER_BUNDLE_ID;
};

/**
 * Fetches the channel for the app.
 *
 * @returns {string} Resolves with the channel or null if not available.
 */
export const getChannel = () => {
  const constants = HotUpdaterNative.getConstants();
  return constants.CHANNEL;
};

/**
 * Fetches the fingerprint for the app.
 *
 * @returns {string | null} Resolves with the fingerprint hash
 */
export const getFingerprintHash = () => {
  const constants = HotUpdaterNative.getConstants();
  return constants.FINGERPRINT_HASH;
};
//# sourceMappingURL=native.js.map