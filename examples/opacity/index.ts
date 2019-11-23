import { opacityProgress, renderStyles, scaleProgress, semigroupStyles } from "../../src/transforms";
import { runnable, Progress } from "../../src/Animation";
import { pipe } from "fp-ts/lib/pipeable";
import { map, getSemiringAnimation } from "../../src";
import { linearDriver } from "../../src/driver";
import { identity } from "fp-ts/lib/function";

const elem = document.getElementById("circle")!;

const pulse = (times: number) => (prog: Progress): Progress => {
  const p = (Math.PI * prog.percentage * times) % Math.PI;
  const s = Math.sin(p);
  return {
    ...prog,
    percentage: s
  };
};

const opacityAnimation =  pipe(
  runnable(5000, identity),
  map(pulse(5)),
  map(opacityProgress)
);

const scaleAnimation =  pipe(
  runnable(10000, identity),
  map(pulse(10)),
  map(scaleProgress)
);

const semiringStyleAnimation = getSemiringAnimation(semigroupStyles);
const animation2 = semiringStyleAnimation.add(opacityAnimation, scaleAnimation);
const foo = pipe(animation2, map(renderStyles(elem)));


linearDriver(foo, 100);
