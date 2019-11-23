import { pipe } from "fp-ts/lib/pipeable";
import { semigroupString } from "fp-ts/lib/Semigroup";
import { runnable } from "./src/Animation";
import { linearDriver, immediateDriver} from "./src/driver";
import { getSemiringAnimation, map } from "./src/index";
import { consoleRender } from "./src/transforms";

const semiring = getSemiringAnimation(semigroupString);

const a1 = runnable(5000, n => "a1")
const a2 = runnable(5000, n => "a2");

const multiplied = semiring.mul(a1, a2);
const summed = semiring.add(a1,a2);

const render = consoleRender("tick: ")

linearDriver(pipe(summed, render), 1000);
// immediateDriver(pipe(summed, render), 1000);