import { Progress } from "./Animation";
import { Endomorphism } from "fp-ts/lib/function";

type Combinator = Endomorphism<Progress>;

//0 - 100 - 0
export const reversable: Combinator = prog => {
  const p = prog.percentage * 2;
  const p2 = p > 1 ? 2 - p : p;
  return { ...prog, percentage: p2 };
};

export const repeat = (times: number): Combinator => prog => {
  if(prog.percentage === 1) return prog;
  const p = (prog.percentage * (times + 1)) % 1;
  return { ...prog, percentage: p };
};

export const backwards: Combinator = prog => ({
  ...prog,
  percentage: 1 - prog.percentage
})

export const log = (msg: string) => <A>(a: A): A => {
  console.info(msg, a);
  return a;
}