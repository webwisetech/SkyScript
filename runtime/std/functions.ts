// deno-lint-ignore-file no-explicit-any
import { run } from "../../main.ts";
import Environment from "../environment.ts";
import { Runtime, MK_NUMBER, NullVal, NumberVal, BooleanVal, StringVal, ObjectVal,MK_NATIVE_FN, MK_NULL, FunctionValue } from "../values.ts";
import * as util from 'node:util'; // https://deno.land/std@0.110.0/node/util.ts
import { execSync } from 'https://deno.land/std@0.177.1/node/child_process.ts';
import colors from 'npm:colors';
import { evaluate } from "../interpreter.ts";
import { Client } from 'npm:discord.js';
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
function nnei(args: Runtime[], _scope: Environment){
    if(args[0] == undefined) throw "The nnei() Function requires input"
    console.log(eval((args[0] as StringVal).value))
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

    return MK_NULL();
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

    return MK_NULL();
}

function blue(args: Runtime[], _scope: Environment){
    const a = colors.blue((args[0] as unknown) as string)
    return { type: "string", value: a } as StringVal;
}

function red(args: Runtime[], _scope: Environment){
    const a = colors.red((args[0] as unknown) as string)
    return { type: "string", value: a } as StringVal;
}

function green(args: Runtime[], _scope: Environment){
    const a = colors.green((args[0] as unknown) as string)
    return { type: "string", value: a } as StringVal;
}

function yellow(args: Runtime[], _scope: Environment){
    const a = colors.yellow((args[0] as unknown) as string)
    return { type: "string", value: a } as StringVal;
}

function cyan(args: Runtime[], _scope: Environment){
    const a = colors.cyan((args[0] as unknown) as string)
    return { type: "string", value: a } as StringVal;
}

function magenta(args: Runtime[], _scope: Environment){
    const a = colors.magenta((args[0] as unknown) as string)
    return { type: "string", value: a } as StringVal;
}

export function println(this: any, args: Runtime[], scope: Environment){
    if(scope.simple != true) return MK_NULL();
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

    return MK_NULL();
}

export function print(this: any, args: Runtime[], scope: Environment){
    if(scope.simple != false) return MK_NULL();
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

    return MK_NULL();
}
type mode = 'simple' | 'advanced';
function envMode(args: Runtime[], scope: Environment){
    switch((args[0] as unknown) as mode){
        case 'simple': {
            scope.simple = true;
        } break;
        case 'advanced': {
            scope.simple = false;
        } break;
    }
    return MK_NULL();
}
function loop(args: Runtime[], scope: Environment){
    //if(!(args[1] as FunctionValue).body) throw "no function found in call";
    if((args[0] as NumberVal).value < 1) throw "minimum loop amouns shouldn't be under 1";
		const env = new Environment(scope);

		let result: Runtime = MK_NULL();
		for(let i = 0; i < (args[0] as NumberVal).value; i++){
            for (const stmt of (args[1] as FunctionValue).body) {
			result = evaluate(stmt, env);
		}
    }

		return result;
}

function wait(args: Runtime[], _scope: Environment){
    const value = (args[0] as NumberVal).value;
    execSync(`sleep ${value}`, {});
    return MK_NULL();
}
function ask(args: Runtime[] | string[], _scope: Environment){
    const data = prompt(args[0] as string);
    return { type: 'string', value: data } as StringVal;
}
function CreateBot(args: Runtime[], scope: Environment){
    const Token = { type: "string", value: (args.shift() as unknown) as string } as StringVal;
    const Status = { type: 'string', value: (args.shift() as unknown) as string } as StringVal;
    scope.declareVar("DiscordBotToken", Token, true);
    scope.declareVar("DiscordBotStatus", Status, true);
    const client = new Client({ intents: ["Guilds"] });
    client.login(Token.value);
    client.on("ready", () => {
        console.log("[SSLOGS] Logged in as "+client.user?.username);
        client.user?.setActivity(Status.value);
    })
    return MK_NULL();
}
const map = new Map<string, Runtime>();

map.set("out", MK_NATIVE_FN(print))

export function stdfun(env: Environment){
    // main std lib
	env.declareVar("out", MK_NATIVE_FN(println), true);
	env.declareVar("time", MK_NATIVE_FN(timeFunction), true);
	env.declareVar("exit", MK_NATIVE_FN(exit), true);
    env.declareVar("run", MK_NATIVE_FN(exec), true);
    env.declareVar("wait", MK_NATIVE_FN(wait), true);
    env.declareVar("ask", MK_NATIVE_FN(ask), true);
    env.declareVar("mode", MK_NATIVE_FN(envMode), true);
    env.declareVar("loop", MK_NATIVE_FN(loop), true);
    // colors
    env.declareVar("blue", MK_NATIVE_FN(blue), true);
    env.declareVar("green", MK_NATIVE_FN(green), true);
    env.declareVar("red", MK_NATIVE_FN(red), true);
    env.declareVar("yellow", MK_NATIVE_FN(yellow), true);
    env.declareVar("cyan", MK_NATIVE_FN(cyan), true);
    env.declareVar("magenta", MK_NATIVE_FN(magenta), true);
    // other std funcs
    env.declareVar("nnei", MK_NATIVE_FN(nnei), true);
    env.declareVar("YellowCat98", MK_NATIVE_FN(YellowCat98), true);
    env.declareVar("nebula", MK_NATIVE_FN(nebula), true);
    env.declareVar("pikala", MK_NATIVE_FN(pikala), true);
    env.declareVar("bot", MK_NATIVE_FN(CreateBot), true)
    env.declareVar("system", {
		type: "object",
		properties: map
	} as ObjectVal, true);
}
