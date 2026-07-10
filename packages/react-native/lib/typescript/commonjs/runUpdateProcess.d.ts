import { type CheckForUpdateOptions } from "./checkForUpdate";
export interface RunUpdateProcessResponse {
    status: "ROLLBACK" | "UPDATE" | "UP_TO_DATE";
    shouldForceUpdate: boolean;
    message: string | null;
    id: string;
}
export interface RunUpdateProcessOptions extends CheckForUpdateOptions {
    /**
     * If `true`, the app will be reloaded when the downloaded bundle is a force update.
     * If `false`, shouldForceUpdate will be returned as true but the app won't reload.
     * @default true
     */
    reloadOnForceUpdate?: boolean;
}
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
export declare const runUpdateProcess: ({ reloadOnForceUpdate, ...checkForUpdateOptions }: RunUpdateProcessOptions) => Promise<RunUpdateProcessResponse>;
//# sourceMappingURL=runUpdateProcess.d.ts.map