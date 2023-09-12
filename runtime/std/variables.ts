import Environment from "../environment.ts";
import { MK_BOOL, makeNull, MK_STR } from "../values.ts";
import * as denopath from "https://deno.land/std@0.188.0/path/mod.ts";
const __filename = denopath.fromFileUrl(import.meta.url);
const __dirname = denopath.dirname(denopath.fromFileUrl(import.meta.url))

export function stdvar(env: Environment){
    env.declareVar("true", MK_BOOL(true), true);
	env.declareVar("false", MK_BOOL(false), true);
	env.declareVar("null", makeNull(), true);
	env.declareVar("dirname", MK_STR(__dirname), true);
	env.declareVar("filename", MK_STR(__filename), true);
}