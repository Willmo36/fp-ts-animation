import $ from "jquery";
import { pipe } from "fp-ts/lib/pipeable";
import { Progress, duration } from "../../src/Animation";
import { map, getSemiringAnimation } from "../../src/index";
import { Semigroup } from "fp-ts/lib/Semigroup";
import { linearDriver } from "../../src/driver";

function main() {
  const elem = document.getElementById("circle")!;

  const opacityAnimation = pipe(
    duration(5000),
    map(opacityProgress)
  );

  const scaleAnimation = pipe(
    duration(10000),
    map(repeat(4)),
    map(reversable),
    map(scaleProgress)
  );


  const foo = pipe(
    scaleAnimation,
    map(render(elem))
  );

  linearDriver(foo, 100);
  // immediateDriver(foo, 1000);
}



/**
 * Style types
 */

type Styles = Partial<{
  opacity: number;
  transform: string;
}>;

export const semigroupStyles: Semigroup<Styles> = {
  concat: (x, y) => ({ ...x, ...y })
};

const semiringStyleAnimation = getSemiringAnimation(semigroupStyles);







/**
 * TRANSFORMS
 */

export const opacityProgress = (prog: Progress): Styles => ({
  opacity: prog.percentage
});

export const scaleProgress = (prog: Progress): Styles => ({
  transform: `scale(${prog.percentage},${prog.percentage})`
});

//0 - 100 - 0
const reversable = (prog: Progress): Progress => {
  const p = prog.percentage * 2;
  const p2 = p > 1 ? 2 - p : p;
  return { ...prog, percentage: p2 };
};

const repeat = (times: number) => (prog: Progress): Progress => {
  const p = (prog.percentage * times) % 1;
  return { ...prog, percentage: p };
};










/**
 * jQuery render
 */
export const render = (elem: HTMLElement) => (
  styles: Styles
) => {
  const record = styles as Record<string, string | number>
  Object.keys(record).map(key => {
    $(elem).css(key, record[key]);
  });
};




main();