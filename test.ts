import { linearDriver } from "./src/driver";
import { runnable } from "./src/Animation";


linearDriver(runnable(5000, n => console.log(n)), 1000);