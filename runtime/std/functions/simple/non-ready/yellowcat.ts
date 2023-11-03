import { SkyScriptErr } from "../../../../../src/util/error.ts";
import { makeNull } from "../../../../values.ts";

export default function(){
    throw new SkyScriptErr("This function isn't ready yet");
    // deno-lint-ignore no-unreachable
    return makeNull();
}