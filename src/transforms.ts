import * as $ from "jquery";
import { map } from "./index";
import { Progress } from "./Animation";
import { Semigroup } from "fp-ts/lib/Semigroup";

export const consoleRender = <A>(msg: string) =>
  map<A, void>(a => {
    console.log(msg, a);
  });


// export const css = (element: HTMLElement)
