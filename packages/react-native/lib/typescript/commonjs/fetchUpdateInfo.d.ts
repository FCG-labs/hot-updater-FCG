import type { AppUpdateInfo, UpdateBundleParams } from "@hot-updater/core";
export type UpdateSource = string | ((params: UpdateBundleParams) => Promise<AppUpdateInfo | null>) | ((params: UpdateBundleParams) => string);
export declare const fetchUpdateInfo: ({ source, params, requestHeaders, onError, requestTimeout, }: {
    source: UpdateSource;
    params: UpdateBundleParams;
    requestHeaders?: Record<string, string>;
    onError?: (error: Error) => void;
    requestTimeout?: number;
}) => Promise<AppUpdateInfo | null>;
//# sourceMappingURL=fetchUpdateInfo.d.ts.map