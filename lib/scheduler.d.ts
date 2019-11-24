declare type Cancel = boolean;
declare type StepFn = (rate: number) => Cancel;
export declare type Scheduler = typeof rafScheduler;
export declare const rafScheduler: (stepFn: StepFn, calls?: number) => void;
export declare const immediateScheduler: (stepFn: StepFn, calls?: number) => void;
export {};
