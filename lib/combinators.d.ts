import { Progress } from "./Animation";
import { Endomorphism } from "fp-ts/lib/function";
declare type Combinator = Endomorphism<Progress>;
export declare const reversable: Combinator;
export declare const repeat: (times: number) => Combinator;
export declare const backwards: Combinator;
export declare const log: (msg: string) => <A>(a: A) => A;
export {};
