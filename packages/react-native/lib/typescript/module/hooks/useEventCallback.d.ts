type EventCallback<Args extends unknown[], R> = ((...args: Args) => R) | undefined;
export declare function useEventCallback<Args extends unknown[], R>(fn: (...args: Args) => R): (...args: Args) => R;
export declare function useEventCallback<Args extends unknown[], R>(fn: EventCallback<Args, R>): EventCallback<Args, R>;
export {};
//# sourceMappingURL=useEventCallback.d.ts.map