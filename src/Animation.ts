import { identity } from "fp-ts/lib/function";

export type Progress = {
  final: number;
  percentage: number;
  value: number;
}

export const URI = "Animation_";
export type URI = typeof URI

declare module "fp-ts/lib/HKT" {
  interface URItoKind<A> {
    Animation_: Animation<A>
  }
}

export type Animation<A> =
  | {
      readonly type: "Runnable";
      readonly value0: number;
      readonly value1: (prog: Progress) => A;
    }
  | {
      readonly type: "Trivial";
    }
  | {
      readonly type: "Cancelled";
    };

export function runnable<A>(
  value0: number,
  value1: (prog: Progress) => A
): Animation<A> {
  return { type: "Runnable", value0, value1 };
}

export const trivial: Animation<never> = { type: "Trivial" };

export const cancelled: Animation<never> = { type: "Cancelled" };

export function fold<A, R>(
  onRunnable: (value0: number, value1: (prog: Progress) => A) => R,
  onTrivial: () => R,
  onCancelled: () => R
): (fa: Animation<A>) => R {
  return fa => {
    switch (fa.type) {
      case "Runnable":
        return onRunnable(fa.value0, fa.value1);
      case "Trivial":
        return onTrivial();
      case "Cancelled":
        return onCancelled();
    }
  };
}

export const duration = (dur: number): Animation<Progress> => runnable(dur, identity);