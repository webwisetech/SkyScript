import Environment from "../environment.ts";
import { MK_BOOL, MK_NULL, StringVal } from "../values.ts";
import * as denopath from "https://deno.land/std@0.188.0/path/mod.ts";
const __filename = denopath.fromFileUrl(import.meta.url);
const __dirname = denopath.dirname(denopath.fromFileUrl(import.meta.url))

export function stdvar(env: Environment){
    env.declareVar("true", MK_BOOL(true), true);
	env.declareVar("false", MK_BOOL(false), true);
	env.declareVar("null", MK_NULL(), true);
	env.declareVar("dirname", { type: "string", value: __dirname} as StringVal, true);
	env.declareVar("filename", { type: "string", value: __filename } as StringVal, true);
}