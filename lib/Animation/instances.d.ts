import { Semiring } from "fp-ts/lib/Semiring";
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
import * as A from "./";
import { Semigroup } from "fp-ts/lib/Semigroup";
import { Functor1 } from "fp-ts/lib/Functor";
import { Monoid } from "fp-ts/lib/Monoid";
export declare const getSemiringAnimation: <A>(sg: Semigroup<A>) => Semiring<A.Animation<A>>;
export declare const functorAnimation: Functor1<A.URI>;
export declare const getMonoidAnimation: <A>(semigroupA: Semigroup<A>) => Monoid<A.Animation<A>>;
export declare const map: <A, B>(f: (a: A) => B) => (fa: A.Animation<A>) => A.Animation<B>;
