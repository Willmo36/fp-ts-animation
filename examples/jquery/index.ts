import { pipe } from "fp-ts/lib/pipeable";
import { Semigroup } from "fp-ts/lib/Semigroup";
import * as Record from "fp-ts/lib/Record";
import { Animation, duration, Progress } from "../../src/Animation";
import { getSemiringAnimation, map, getMonoidAnimation } from "../../src/index";
import { run } from "../../src/run";
import { rafScheduler } from "../../src/scheduler";
import { repeat, reversable, log, backwards } from "../../src/combinators";

function main() {
  const elem = document.getElementById("circle")!;

  const opacityAnimation = pipe(
    duration(5000),
    map(opacity)
  );

  const borderRadiusAnimation = pipe(
    duration(2000),
    map(p => ({...p, percentage: p.percentage * 0.5})),
    map(borderRadius)
  );

  const scaleAnimation = pipe(
    duration(2000),
    map(repeat(2)),
    map(reversable),
    map(backwards),
    map(scale)
  );

  const all: Animation<Styles>[] = [
    scaleAnimation,
    opacityAnimation,
    borderRadiusAnimation
  ];


  const animation = pipe(
    all.reduce(semiring.add, monoid.empty),
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
const semiring = getSemiringAnimation(semigroupStyles);
const monoid = getMonoidAnimation(semigroupStyles);

/**
 * jQuery combinators
 */

export const opacity = (prog: Progress): Styles => ({
  opacity: prog.percentage
});

export const borderRadius = (prog: Progress): Styles => ({
  "border-radius": (prog.percentage * 100) + "%"
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
