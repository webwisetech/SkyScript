import util from "https://deno.land/std@0.177.1/node/util.ts";
import Environment from "../../../../environment.ts";
import { Runtime,makeNull,NumberValue,StringValue,BooleanValue,NullValue } from "../../../../values.ts";

// deno-lint-ignore no-explicit-any
export default function(this: any, args: Runtime[], scope: Environment){
    if(scope.simple != true) return makeNull();
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