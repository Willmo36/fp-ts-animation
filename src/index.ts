import * as IO from "fp-ts/lib/IO";
import {Monoid} from "fp-ts/lib/Monoid";
import { Semiring } from "fp-ts/lib/Semiring";


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
 */

type Animation<A> = 
  | {tag: 'runnable', duration: number, value: (progress: number ) => A}
  | {tag: 'cancelled'}
  | {tag: 'trivial'}

const animation = <A>(duration: number, value: (p: number) => A): Animation<A> => ({tag: "runnable", duration, value});
const cancelled: Animation<unknown> = {tag: 'cancelled'}
const trivial: Animation<unknown> = {tag: 'trivial'}

const fold = <A, B>(c1: (duration: number, value: (n: number) => A) => B, c2: () => B, c3: () => B) => (animation: Animation<A>) => {
  switch (animation.tag){
    case "runnable":
       return c1(animation.duration,animation.value);
    case "cancelled":
      return c2();
    case ""
  }
}


const getSemiringAnimation = <A>(): Semiring<Animation<A>> => ({
  zero: cancelled,
  one: trivial,
  add: (a,b) => ({dur: Math.max(a.dur, b.dur)}), //same time
  mul: (a, b) => ({dur: a.dur + b.dur})         //one after the other
})

function runTween(spec: TweenSpec, step: (step: TweenStep) => IO.IO<never>) {

} 