export type HotUpdaterState = {
    progress: number;
    isUpdateDownloaded: boolean;
};
export declare const hotUpdaterStore: {
    getSnapshot: () => HotUpdaterState;
    setState: (newState: Partial<HotUpdaterState>) => void;
    subscribe: (listener: () => void) => () => boolean;
};
export declare const useHotUpdaterStore: <T = HotUpdaterState>(selector?: (snapshot: HotUpdaterState) => T) => T;
//# sourceMappingURL=store.d.ts.map