import { Animation } from "./Animation";
export declare const run: (schedule: (stepFn: (rate: number) => boolean, calls?: number) => void) => <A>(animation: Animation<A>) => void;
