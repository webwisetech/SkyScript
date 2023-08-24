// deno-lint-ignore-file no-explicit-any
import { run } from "../../main.ts";
import Environment from "../environment.ts";
import { Runtime, MK_NUMBER, NullVal, NumberVal, BooleanVal, StringVal, MK_NATIVE_FN, MK_NULL } from "../values.ts";
import * as util from 'util';

function timeFunction(_args: Runtime[], _env: Environment) {
    return MK_NUMBER(Date.now());
}

function YellowCat98(){
    console.log("YellowCat98");
    return MK_NULL();
}
function nebula(){
    console.log("nebula");
    return MK_NULL(); 
}
function nnei(){
    console.log("Nnei");
    return MK_NULL(); 
}
function pikala(){
    console.log("pikala");
    return MK_NULL();
}
function exec(args: Runtime[], _scope: Environment){
    // deno-lint-ignore no-inferrable-types
    let file: string = "error";
    for(const arg of args){
        switch(arg.type){
            case "string":
                file = (arg as StringVal).value
                continue;
        }
    }
    run(file);

    return { type: "string", value: "" } as StringVal; 
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

    return { type: "string", value: "" } as StringVal; 
}

export function stdfun(env: Environment){
	env.declareVar("out", MK_NATIVE_FN(println), true);
	env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
	env.declareVar("exit", MK_NATIVE_FN(exit), true);
    env.declareVar("run", MK_NATIVE_FN(exec), true);
    env.declareVar("nnei", MK_NATIVE_FN(nnei), true);
    env.declareVar("YellowCat98", MK_NATIVE_FN(YellowCat98), true);
    env.declareVar("nebula", MK_NATIVE_FN(nebula), true);
    env.declareVar("pikala", MK_NATIVE_FN(pikala), true);
}
