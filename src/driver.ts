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
    fold<A, NodeJS.Timeout[]>(
      (dur, tick) =>
        pipe(
          Array.range(1, Math.floor(dur / percision)),
          Array.mapWithIndex((_, i) => i * percision),
          Array.map(part =>
            setTimeout(() => {
              tick(part);
            }, part)
          )
        ),
      () => [],
      () => []
    )
  );

  return () => {
    pipe(
      timeouts,
      Array.map(timeout => {
        clearTimeout(timeout);
      })
    );
  };
}

export function immediateDriver<A>(
  animation: Animation<A>,
  percision: number
): CancelDriver {
  pipe(
    animation,
    fold<A, void>(
      (dur, tick) =>
        pipe(
          Array.range(1, Math.floor(dur / percision)),
          Array.mapWithIndex((_, i) => i * percision),
          Array.map(part => tick(part))
        ),
      () => [],
      () => []
    )
  );

  return () => {};
}
