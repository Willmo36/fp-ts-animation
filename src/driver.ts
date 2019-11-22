import { Animation, fold } from "./Animation";
import { pipe } from "fp-ts/lib/pipeable";
import * as Array from "fp-ts/lib/Array";

export type CancelDriver = () => void;

export function linearDriver<A>(
  animation: Animation<A>,
  percision: number
): CancelDriver {
  const timeouts = pipe(
    animation,
    fold<A, number[]>(
      (dur, tick) => {
        const rate = Math.floor(dur / percision);
        return pipe(
          Array.range(1, rate),
          Array.mapWithIndex((_, i) => i * percision),
          Array.map(part =>
            setTimeout(() => {
              tick(part);
            }, part)
          )
        );
      },
      () => [],
      () => []
    )
  );

  return () => {
    pipe(
      timeouts,
      Array.map(timeout => {
        window.clearTimeout(timeout);
      })
    );
  };
}
