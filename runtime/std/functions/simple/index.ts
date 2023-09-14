// Other imports //
import Environment from "../../../environment.ts";
import { MakeNativeFunc } from "../../../values.ts";
// time //
import now from './time/now.ts';
// process //
import exit from './process/exit.ts';
import exec from './process/exec.ts';
// math //
import nnei from "./math/nnei.ts";
// non-ready //
import nebula from "./non-ready/nebula.ts";
import pikala from "./non-ready/pikala.ts";
import yellowcat from "./non-ready/yellowcat.ts";

export default function(env: Environment){
	// time //
	env.declareVar("now", MakeNativeFunc(now), true);
	// process //
	env.declareVar("exit", MakeNativeFunc(exit), true);
	env.declareVar("run", MakeNativeFunc(exec), true);
	// math //
	env.declareVar("nnei", MakeNativeFunc(nnei), true);
	// non-ready //
	env.declareVar("yellowcat", MakeNativeFunc(yellowcat), true);
    env.declareVar("nebula", MakeNativeFunc(nebula), true);
    env.declareVar("pikala", MakeNativeFunc(pikala), true);
}