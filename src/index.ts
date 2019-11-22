import * as IO from "fp-ts/lib/IO";
import { Monoid } from "fp-ts/lib/Monoid";
import { Semiring } from "fp-ts/lib/Semiring";
import { pipe } from "fp-ts/lib/pipeable";

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
              const val = (dur: number) => {
                const x1 = xVal(dur);
                const y1 = yVal(dur);
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
              const val = (t: number) => {
                if (t <= ratio && xDur !== 0) {
                  return xVal(t / ratio);
                } else {
                  return yVal((t - ratio) / (1 - ratio));
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

const getSemiringAnimation = <A>(sg: Semigroup<A>): Semiring<Animation<A>> => ({
  zero: A.cancelled,
  one: A.trivial,
  add: getAdd(sg),
  mul: mult
});

//todo functor
//todo "driver" --- https://github.com/bkase/swift-fp-animations/blob/master/Sources/AnimationsCore/Driver.swift