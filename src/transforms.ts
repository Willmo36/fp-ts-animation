import {map} from "./index";

export const consoleRender = <A>(msg: string) => map<A, void>(a => {
    console.log(msg, a);
});

export const opacity = map<number, {opacity: number}>(a => ({opacity: a}))
export const width = map<number, {width: number}>(a => ({width: a}))