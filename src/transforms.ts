import * as $ from "jquery";
import { map } from "./index";
import { Progress } from "./Animation";
import { Semigroup } from "fp-ts/lib/Semigroup";

export const consoleRender = <A>(msg: string) =>
  map<A, void>(a => {
    console.log(msg, a);
  });

type Styles = Partial<{
  opacity: number;
  transform: string;
}>;

export const semigroupStyles: Semigroup<Styles> = {
    concat: (x,y) => ({...x, ...y})
}

export const opacityProgress = (prog: Progress): Styles => ({
  opacity: prog.percentage
});

export const scaleProgress = (prog:Progress): Styles => ({
    transform: `scale(${prog.percentage},${prog.percentage})`
})


export const renderStyles = (elem: HTMLElement) => (
  styles: Record<string, string | number>
) => {
  console.log("stepping", styles, elem);
  Object.keys(styles).map(key => {
    $.default(elem).css(key, styles[key]);
  });
};

// export const css = (element: HTMLElement)
