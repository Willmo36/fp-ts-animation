import { Semiring } from "fp-ts/lib/Semiring";
import { pipe, pipeable } from "fp-ts/lib/pipeable";
import * as A from "./";
import { Semigroup } from "fp-ts/lib/Semigroup";
import { Functor1 } from "fp-ts/lib/Functor";
import { Monoid } from "fp-ts/lib/Monoid";

type Animation<A> = A.Animation<A>;

const getAdd = <A>(sg: Semigroup<A>) => (
  x: Animation<A>,
  y: Animation<A>
): Animation<A> =>
  pipe(
    x,
    A.fold(
      (xDur, xSink) =>
        pipe(
          y,
          A.fold(
            (yDur, ySink) => {
              const dur = Math.max(xDur, yDur);
              const sink = (prog: A.Progress) => {
                const x1 = xSink(prog);
                const y1 = ySink(prog);
                return sg.concat(x1, y1);
              };
              return A.runnable(dur, sink);
            },
            () => x,
            () => x
          )
        ),
      () =>
        pipe(
          y,
          A.fold(() => y, () => A.trivial, () => A.trivial)
        ),
      () =>
        pipe(
          y,
          A.fold(() => y, () => A.trivial, () => A.cancelled)
        )
    )
  );

//sequence animation
const mult = <A>(x: Animation<A>, y: Animation<A>): Animation<A> =>
  pipe(
    x,
    A.fold(
      (xDur, xSink) =>
        pipe(
          y,
          A.fold(
            (yDur, ySink) => {
              const dur = xDur + yDur;

              const val = (xyProg: A.Progress) => {
                const xRatio = xDur / xyProg.final;

                if (xyProg.value <= xDur && xDur !== 0) {
                  const xPercentage = xyProg.percentage * xRatio;
                  const xProg: A.Progress = {
                    value: xyProg.value,
                    final: xDur,
                    percentage: xPercentage
                  };

                  return xSink(xProg);
                } else {
                  const yValue = xyProg.value - xDur;
                  const yPercentage = yValue / yDur;
                  const yProg: A.Progress = {
                    value: xyProg.value,
                    final: yDur,
                    percentage: yPercentage
                  };
                  return ySink(yProg);
                }
              };

              return A.runnable(dur, val);
            },
            () => x,
            () => A.cancelled
          )
        ),
      () => y,
      () => A.cancelled
    )
  );

export const getSemiringAnimation = <A>(
  sg: Semigroup<A>
): Semiring<Animation<A>> => ({
  zero: A.cancelled,
  one: A.trivial,
  add: getAdd(sg),
  mul: mult
});

export const functorAnimation: Functor1<A.URI> = {
  URI: A.URI,
  map: (fa, f) =>
    pipe(
      fa,
      A.fold(
        (dur, sink) => A.runnable(dur, n => f(sink(n))),
        () => A.trivial,
        () => A.cancelled
      )
    )
};

export const getMonoidAnimation = <A>(semigroupA: Semigroup<A>): Monoid<A.Animation<A>> => ({
  empty: A.trivial,
  concat: getAdd(semigroupA),
});

export const { map } = pipeable(functorAnimation);
