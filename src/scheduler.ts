type Cancel = boolean;
type StepFn = (rate: number) => Cancel;

const FRAME = 16;

export type Scheduler = typeof rafScheduler;

export const rafScheduler = (stepFn: StepFn, calls = 0) => {
  requestAnimationFrame(() => {
    const cancel = stepFn(FRAME * (calls + 1));
    if (!cancel) {
      rafScheduler(stepFn, calls + 1);
    }
  });
};

export const immediateScheduler = (stepFn: StepFn, calls = 0) => {
  const cancel = stepFn(FRAME * (calls + 1));
  if (!cancel) {
    immediateScheduler(stepFn, calls + 1);
  }
};
