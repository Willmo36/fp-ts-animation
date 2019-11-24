import { pipe } from "fp-ts/lib/pipeable";
import { Semigroup } from "fp-ts/lib/Semigroup";
import * as Record from "fp-ts/lib/Record";
import { duration, Progress } from "../../src/Animation";
import { getSemiringAnimation, map } from "../../src/index";
import { run } from "../../src/run";
import { rafScheduler } from "../../src/scheduler";
import { repeat, reversable } from "../../src/combinators";

function main() {
  const elem = document.getElementById("circle")!;

  const opacityAnimation = pipe(
    duration(5000),
    map(opacity)
  );

  const scaleAnimation = pipe(
    duration(5000),
    map(repeat(4)),
    map(reversable),
    map(scale)
  );

  const animation = pipe(
    semiringStyleAnimation.add(scaleAnimation, opacityAnimation),
    map(render(elem))
  );

  run(rafScheduler)(animation);
}

/**
 * Style types
 */

type Styles = Record<string, string | number>;
export const semigroupStyles: Semigroup<Styles> = {
  concat: (x, y) => ({ ...x, ...y })
};
const semiringStyleAnimation = getSemiringAnimation(semigroupStyles);

/**
 * jQuery combinators
 */

export const opacity = (prog: Progress): Styles => ({
  opacity: prog.percentage
});

export const scale = (prog: Progress): Styles => ({
  transform: `scale(${prog.percentage},${prog.percentage})`
});

export const render = (elem: HTMLElement) => (styles: Styles) => {
  const record = styles as Record<string, string | number>;
  Object.keys(record).map(key => {
    $(elem).css(key, record[key]);
  });
};

main();
