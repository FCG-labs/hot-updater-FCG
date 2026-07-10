import React from "react";
import { type CheckForUpdateOptions } from "./checkForUpdate";
import type { HotUpdaterError } from "./error";
import type { RunUpdateProcessResponse } from "./runUpdateProcess";
type UpdateStatus = "CHECK_FOR_UPDATE" | "UPDATING" | "UPDATE_PROCESS_COMPLETED";
export interface HotUpdaterOptions extends CheckForUpdateOptions {
    /**
     * Component to show while downloading a new bundle update.
     *
     * When an update exists and the bundle is being downloaded, this component will block access
     * to the entry point and show download progress.
     *
     * @see {@link https://hot-updater.dev/docs/react-native-api/wrap#fallback-component}
     *
     * ```tsx
     * HotUpdater.wrap({
     *   source: "<update-server-url>",
     *   fallbackComponent: ({ progress = 0 }) => (
     *     <View style={styles.container}>
     *       <Text style={styles.text}>Updating... {progress}%</Text>
     *     </View>
     *   )
     * })(App)
     * ```
     *
     * If not defined, the bundle will download in the background without blocking the screen.
     */
    fallbackComponent?: React.FC<{
        status: Exclude<UpdateStatus, "UPDATE_PROCESS_COMPLETED">;
        progress: number;
        message: string | null;
    }>;
    onError?: (error: HotUpdaterError | Error | unknown) => void;
    onProgress?: (progress: number) => void;
    /**
     * When a force update exists, the app will automatically reload.
     * If `false`, When a force update exists, the app will not reload. `shouldForceUpdate` will be returned as `true` in `onUpdateProcessCompleted`.
     * If `true`, When a force update exists, the app will automatically reload.
     * @default true
     */
    reloadOnForceUpdate?: boolean;
    /**
     * Callback function that is called when the update process is completed.
     *
     * @see {@link https://hot-updater.dev/docs/react-native-api/wrap#onupdateprocesscompleted}
     */
    onUpdateProcessCompleted?: (response: RunUpdateProcessResponse) => void;
}
export declare function wrap<P extends React.JSX.IntrinsicAttributes = object>(options: HotUpdaterOptions): (WrappedComponent: React.ComponentType<P>) => React.ComponentType<P>;
export {};
//# sourceMappingURL=wrap.d.ts.map