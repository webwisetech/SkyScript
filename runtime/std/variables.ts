import Environment from "../environment.ts";
import { MK_BOOL,MK_NULL } from "../values.ts";

export function stdvar(env: Environment){
    env.declareVar("true", MK_BOOL(true), true);
	env.declareVar("false", MK_BOOL(false), true);
	env.declareVar("null", MK_NULL(), true);
}