type Cancel = boolean;
type Sink = (rate: number) => Cancel;

const FRAME = 16;

export type Scheduler = typeof rafScheduler;

export const rafScheduler = (sink: Sink, calls = 0) => {
  requestAnimationFrame(() => {
    const cancel = sink(FRAME * (calls + 1));
    if (!cancel) {
      rafScheduler(sink, calls + 1);
    }
  });
};

export const immediateScheduler = (stepFn: Sink, calls = 0) => {
  const cancel = stepFn(FRAME * (calls + 1));
  if (!cancel) {
    immediateScheduler(stepFn, calls + 1);
  }
};
