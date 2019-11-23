import { Animation, fold } from "./Animation";
import { pipe } from "fp-ts/lib/pipeable";
import * as Array from "fp-ts/lib/Array";

export type CancelDriver = () => void;

export function linearDriver<A>(
  animation: Animation<A>,
  unit: number
): CancelDriver {
  const timeouts = pipe(
    animation,
    fold<A, NodeJS.Timeout[]>(
      (dur, tick) =>
        pipe(
          Array.range(1, Math.floor(dur / unit)),
          Array.mapWithIndex((_, i) => i * unit),
          Array.map(value =>
            setTimeout(() => {
              const percentage = value / dur;
              return tick({ value, final: dur, percentage });
            }, value)
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
  unit: number
): CancelDriver {
  pipe(
    animation,
    fold<A, void>(
      (dur, tick) =>
        pipe(
          Array.range(1, Math.floor(dur / unit)),
          Array.mapWithIndex((_, i) => i * unit),
          Array.map(value => {
            const percentage = value / dur;
            return tick({ value, final: dur, percentage });
          })
        ),
      () => [],
      () => []
    )
  );

  return () => {};
}
