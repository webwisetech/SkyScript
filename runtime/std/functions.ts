// deno-lint-ignore-file no-explicit-any
import simple from './functions/simple/index.ts';
import Environment from "../environment.ts";
import { Runtime, NullValue, NumberValue, BooleanValue, StringValue, ObjectValue,MakeNativeFunc, makeNull } from "../values.ts";
import * as util from 'node:util';

export function print(this: any, args: Runtime[], scope: Environment){
    if(scope.simple != false) return makeNull();
    const log = []

    for (const arg of args) {
        switch (arg.type) {
            case 'number':
                log.push(((arg as NumberValue).value))
                continue
            case 'string':
                log.push((arg as StringValue).value)
                continue
            case 'boolean':
                log.push(((arg as BooleanValue).value))
                continue
            case 'null':
                log.push(((arg as NullValue).value))
                continue
            default:
                log.push(arg)
        }
    }

    console.log(util.format.apply(this, log))

    return makeNull();
}

const map = new Map<string, Runtime>();
map.set("out", MakeNativeFunc(print))

export function stdfun(env: Environment){
    
    simple(env);
    env.declareVar("system", {
		type: "object",
		properties: map
	} as ObjectValue, true);
}