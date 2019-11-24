import { Semigroup } from "fp-ts/lib/Semigroup";
import { Progress } from "../../src/Animation";
/**
 * Style types
 */
declare type Styles = Record<string, string | number>;
export declare const semigroupStyles: Semigroup<Styles>;
/**
 * jQuery combinators
 */
export declare const opacity: (prog: Progress) => Record<string, string | number>;
export declare const borderRadius: (prog: Progress) => Record<string, string | number>;
export declare const scale: (prog: Progress) => Record<string, string | number>;
export declare const render: (elem: HTMLElement) => (styles: Record<string, string | number>) => void;
export {};
