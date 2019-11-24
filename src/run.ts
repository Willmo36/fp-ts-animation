import { Animation, fold } from "./Animation";
import { pipe } from "fp-ts/lib/pipeable";
import { Scheduler } from "./scheduler";

export const run = (schedule: Scheduler) => <A>(animation: Animation<A>) =>
  pipe(
    animation,
    fold(
      (duration, tickFn) => {
        schedule(step => {
          if (step > duration) return false;
          const percentage = step / duration;
          tickFn({ value: step, final: duration, percentage });
          return false;
        });
      },
      () => {},
      () => {}
    )
  );
