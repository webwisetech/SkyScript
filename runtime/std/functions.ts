// deno-lint-ignore-file no-explicit-any
import Environment from "../environment.ts";
import { Runtime, MK_NUMBER, NullVal, NumberVal, BooleanVal, StringVal, MK_NATIVE_FN } from "../values.ts";
import * as util from 'node:util';

function timeFunction(_args: Runtime[], _env: Environment) {
    return MK_NUMBER(Date.now());
}


function exit(args: Runtime[], _scope: Environment) {
    if (args[0] == undefined || args[0].type != 'number') {
        console.log(`Process exited with exit code: 1`)
        Deno.exit(1)
    } else if ((args[0] as NumberVal).value == 0) {
        console.log(`Process exited with exit code: 0`)
        Deno.exit(0)
    } else {
        console.log(`Process exited with exit code: 1`)
        Deno.exit(1)
    }

    return { type: 'null', value: null } as NullVal;
}
function println(this: any, args: Runtime[], _scope: Environment){
    // deno-lint-ignore prefer-const
    let log: any[] = []

    for (const arg of args) {
        switch (arg.type) {
            case 'number':
                log.push(((arg as NumberVal).value))
                continue
            case 'string':
                log.push((arg as StringVal).value)
                continue
            case 'boolean':
                log.push(((arg as BooleanVal).value))
                continue
            case 'null':
                log.push(((arg as NullVal).value))
                continue
            default:
                log.push(arg)
        }
    }

    console.log(util.format.apply(this, log))

    return {} as Runtime; 
}

export function stdfun(env: Environment){
	env.declareVar("out", MK_NATIVE_FN(println), true);
	env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
	env.declareVar("exit", MK_NATIVE_FN(exit), true);
}