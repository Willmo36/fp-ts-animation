import { pipe } from "fp-ts/lib/pipeable";
import { semigroupString } from "fp-ts/lib/Semigroup";
import { runnable } from "./src/Animation";
import { linearDriver, immediateDriver} from "./src/driver";
import { getSemiringAnimation, map } from "./src/index";

const semiring = getSemiringAnimation(semigroupString);

const a1 = runnable(5000, n => "a1")
const a2 = runnable(5000, n => "a2");

const a3 = semiring.mul(a1, a2);
const a4 = pipe(a3, map(n => console.log(n)));

// linearDriver(a4, 1000);
immediateDriver(a4, 1000);