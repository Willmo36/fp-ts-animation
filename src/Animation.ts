export type Animation<A> =
  | {
      readonly type: "Runnable";
      readonly value0: number;
      readonly value1: A;
    }
  | {
      readonly type: "Trivial";
    }
  | {
      readonly type: "Cancelled";
    };

export function runnable<A>(value0: number, value1: A): Animation<A> {
  return { type: "Runnable", value0, value1 };
}

export const trivial: Animation<never> = { type: "Trivial" };

export const cancelled: Animation<never> = { type: "Cancelled" };

export function fold<A, R>(
  onRunnable: (value0: number, value1: A) => R,
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

import { Eq, fromEquals } from "fp-ts/lib/Eq";
import { Prism } from "monocle-ts";

export function _runnable<A>(): Prism<Animation<A>, Animation<A>> {
  return Prism.fromPredicate(s => s.type === "Runnable");
}

export function _trivial<A>(): Prism<Animation<A>, Animation<A>> {
  return Prism.fromPredicate(s => s.type === "Trivial");
}

export function _cancelled<A>(): Prism<Animation<A>, Animation<A>> {
  return Prism.fromPredicate(s => s.type === "Cancelled");
}

export function getEq<A>(
  eqRunnableValue0: Eq<number>,
  eqRunnableValue1: Eq<A>
): Eq<Animation<A>> {
  return fromEquals((x, y) => {
    if (x.type === "Runnable" && y.type === "Runnable") {
      return (
        eqRunnableValue0.equals(x.value0, y.value0) &&
        eqRunnableValue1.equals(x.value1, y.value1)
      );
    }
    if (x.type === "Trivial" && y.type === "Trivial") {
      return true;
    }
    if (x.type === "Cancelled" && y.type === "Cancelled") {
      return true;
    }
    return false;
  });
}
