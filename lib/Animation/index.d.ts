export declare type Progress = {
    final: number;
    percentage: number;
    value: number;
};
export declare const URI = "Animation_";
export declare type URI = typeof URI;
declare module "fp-ts/lib/HKT" {
    interface URItoKind<A> {
        Animation_: Animation<A>;
    }
}
export declare type Animation<A> = {
    readonly type: "Runnable";
    readonly value0: number;
    readonly value1: (prog: Progress) => A;
} | {
    readonly type: "Trivial";
} | {
    readonly type: "Cancelled";
};
export declare function runnable<A>(value0: number, value1: (prog: Progress) => A): Animation<A>;
export declare const trivial: Animation<never>;
export declare const cancelled: Animation<never>;
export declare function fold<A, R>(onRunnable: (value0: number, value1: (prog: Progress) => A) => R, onTrivial: () => R, onCancelled: () => R): (fa: Animation<A>) => R;
export declare const duration: (dur: number) => Animation<Progress>;
