import type { TurboModule } from "react-native";
export interface UpdateBundleParams {
    bundleId: string;
    fileUrl: string | null;
    /**
     * SHA256 hash of the bundle file for integrity verification.
     * If provided, the native layer will verify the downloaded file's hash.
     */
    fileHash: string | null;
}
export interface Spec extends TurboModule {
    reload(): Promise<void>;
    updateBundle(params: UpdateBundleParams): Promise<boolean>;
    addListener(eventName: string): void;
    removeListeners(count: number): void;
    readonly getConstants: () => {
        MIN_BUNDLE_ID: string;
        APP_VERSION: string | null;
        CHANNEL: string;
        FINGERPRINT_HASH: string | null;
    };
}
declare const _default: Spec;
export default _default;
//# sourceMappingURL=NativeHotUpdater.d.ts.map