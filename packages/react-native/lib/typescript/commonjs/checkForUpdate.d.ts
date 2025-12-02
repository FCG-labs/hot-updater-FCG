import type { AppUpdateInfo, UpdateBundleParams } from "@hot-updater/core";
import { type UpdateSource } from "./fetchUpdateInfo";
export interface CheckForUpdateOptions {
    source: UpdateSource;
    requestHeaders?: Record<string, string>;
    onError?: (error: Error) => void;
    /**
     * The timeout duration for the request.
     * @default 5000
     */
    requestTimeout?: number;
    /**
     * Override the channel for this request only.
     * The native channel remains unchanged (isolation key preserved).
     *
     * ⚠️ WARNING: Use with caution in production.
     * Receiving bundles from a different channel may cause unexpected behavior.
     * Intended for development/QA purposes only.
     *
     * @example
     * ```ts
     * await HotUpdater.checkForUpdate({
     *   source: getUpdateSource(...),
     *   channelOverride: 'stage', // Request stage bundles instead of production
     * });
     * ```
     */
    channelOverride?: string;
}
export type CheckForUpdateResult = AppUpdateInfo & {
    /**
     * Updates the bundle.
     * This method is equivalent to `HotUpdater.updateBundle()` but with all required arguments pre-filled.
     */
    updateBundle: () => Promise<boolean>;
};
export declare function checkForUpdate(options: CheckForUpdateOptions): Promise<CheckForUpdateResult | null>;
export interface GetUpdateSourceOptions {
    /**
     * The update strategy to use.
     * @description
     * - "fingerprint": Use the fingerprint hash to check for updates.
     * - "appVersion": Use the target app version to check for updates.
     */
    updateStrategy: "appVersion" | "fingerprint";
}
export declare const getUpdateSource: (baseUrl: string, options: GetUpdateSourceOptions) => (params: UpdateBundleParams) => string;
//# sourceMappingURL=checkForUpdate.d.ts.map