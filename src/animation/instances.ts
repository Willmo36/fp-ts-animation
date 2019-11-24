import { Semiring } from "fp-ts/lib/Semiring";
import { pipe, pipeable } from "fp-ts/lib/pipeable";

//https://bkase.github.io/slides/algebra-driven-design/#/58
//https://github.com/bkase/swift-fp-animations/blob/master/Sources/AnimationsCore/Animations.swift

/**
 * In essence, the animation type is a way to distribute intervals up to the duration
 * linear, swing, tween all are different types of distribution over real time
 * The "result" to the call back is this interval number
 * so for linear of 10s, it'll be 1,2,3,4,5 etc
 * and that callback will be called once per interval with that interval
 *
 * Having this callback, this value, makes the Monad very much like an Observable
 * from this we can decide the functor, applicative and monad instances
 * For example, mapping is f over each interval
 * animation.map(step => IO(render(step))) :: Animation<IO<never>>
 * Above is a series of side effects applying the animation to something
 *
 * ofc the ability to map means the ability to map curried functions, leading to applicative
 * animationA.map(add) :: Animation<Num -> Num>
 *
 * Potential idea - instead of just emitting an interval perhaps have it as a percentage of the initial duration
 * How would this work with a bezier curve though? Where does above 100% before the end? hmmm
 * I guess it'll be another constructor for Animation (Linear | Tween | Bezier Curve)
 *
https://docs.google.com/spreadsheets/d/1PwZPOd5Bm4HbBhETj-56S3CEIRJJjHO7naMTRX7KtQU/edit#gid=0
 *
 */

import * as A from "./Animation";
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
      (xDur, xVal) =>
        pipe(
          y,
          A.fold(
            (yDur, yVal) => {
              const dur = Math.max(xDur, yDur);
              const val = (prog: A.Progress) => {
                const x1 = xVal(prog);
                const y1 = yVal(prog);
                return sg.concat(x1, y1);
              };
              return A.runnable(dur, val);
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
      (xDur, xVal) =>
        pipe(
          y,
          A.fold(
            (yDur, yVal) => {
              const dur = xDur + yDur;
              const ratio = xDur / dur;

              const val = (xyProg: A.Progress) => {
                //divvy up the progress
                //which "side" of the progress are we in?

                //these are correct
                const xRatio = xDur / xyProg.final;
                const yRatio = 1 - xRatio;

                if (xyProg.value <= xDur && xDur !== 0) {
                  //find the ratio of xDur of xyDur
                  //then multiple xyProg.value by that ratio
                  //to get the percentage through xDur

                  const xPercentage = xyProg.percentage * xRatio;

                  const xProg: A.Progress = {
                    value: xyProg.value,
                    final: xDur,
                    // the 100 here is defo wrong, it should be the "unit" from the driver...
                    percentage: xPercentage
                  };

                  return xVal(xProg);
                } else {
                  const yValue = xyProg.value - xDur;
                  const yPercentage = yValue / yDur;
                  const yProg: A.Progress = {
                    value: xyProg.value,
                    final: yDur,
                    percentage: yPercentage
                  };
                  return yVal(yProg);
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
        (dur, tick) => A.runnable(dur, n => f(tick(n))),
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
