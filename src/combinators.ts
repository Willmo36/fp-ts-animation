import { Progress } from "./Animation";

//0 - 100 - 0
export const reversable = (prog: Progress): Progress => {
  const p = prog.percentage * 2;
  const p2 = p > 1 ? 2 - p : p;
  return { ...prog, percentage: p2 };
};

export const repeat = (times: number) => (prog: Progress): Progress => {
  const p = (prog.percentage * times) % 1;
  return { ...prog, percentage: p };
};