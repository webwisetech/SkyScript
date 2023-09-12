// deno-lint-ignore-file no-explicit-any
import { run } from "../../main.ts";
import Environment from "../environment.ts";
import { Runtime, MK_NUMBER, NullValue, NumberValue, BooleanValue, StringValue, ObjectValue,MK_NATIVE_FN, makeNull, FunctionValue } from "../values.ts";
import * as util from 'node:util'; // https://deno.land/std@0.110.0/node/util.ts
import { execSync } from 'https://deno.land/std@0.177.1/node/child_process.ts';
import colors from 'npm:colors';
import { evaluate } from "../interpreter.ts";
import { Client, Message, Role } from 'npm:discord.js';
import { memory } from '../localDB/memory.ts';
import { Statement } from "../../frontend/ast.ts";

function timeFunction(_args: Runtime[], _env: Environment) {
    return MK_NUMBER(Date.now());
}

function YellowCat98(){
    console.log("YellowCat98");
    return makeNull();
}
function nebula(){
    console.log("nebula");
    return makeNull(); 
}
function nnei(args: Runtime[], _scope: Environment){
    if(args[0] == undefined) throw "The nnei() Function requires input"
    console.log(eval((args[0] as StringValue).value))
    return makeNull(); 
}
function pikala(){
    console.log("pikala");
    return makeNull();
}
function exec(args: Runtime[], _scope: Environment){
    // deno-lint-ignore no-inferrable-types
    let file: string = "error";
    for(const arg of args){
        switch(arg.type){
            case "string":
                file = (arg as StringValue).value
                continue;
        }
    }
    run(file);

    return makeNull();
}

function exit(args: Runtime[], _scope: Environment) {
    if (args[0] == undefined || args[0].type != 'number') {
        console.log(`Process exited with exit code: 1`)
        Deno.exit(1)
    } else if ((args[0] as NumberValue).value == 0) {
        console.log(`Process exited with exit code: 0`)
        Deno.exit(0)
    } else {
        console.log(`Process exited with exit code: 1`)
        Deno.exit(1)
    }

    return makeNull();
}

function blue(args: Runtime[], _scope: Environment){
    const a = colors.blue((args[0] as unknown) as string)
    
    return { type: "string", value: a } as StringValue;
}

function red(args: Runtime[], _scope: Environment){
    const a = colors.red((args[0] as unknown) as string)
    
    return { type: "string", value: a } as StringValue;
}

function green(args: Runtime[], _scope: Environment){
    const a = colors.green((args[0] as unknown) as string)
    
    return { type: "string", value: a } as StringValue;
}

function yellow(args: Runtime[], _scope: Environment){
    const a = colors.yellow((args[0] as unknown) as string)
    
    return { type: "string", value: a } as StringValue;
}

function cyan(args: Runtime[], _scope: Environment){
    if((args[0] as StringValue).value !== null || (args[0] as StringValue).value !== undefined){
        const b = colors.cyan((args[0] as StringValue).value);
        return { type: "string", value: b } as StringValue;
    }
    const a = colors.cyan((args[0] as unknown) as string)
    return { type: "string", value: a } as StringValue;
}

function magenta(args: Runtime[], _scope: Environment){
    const a = colors.magenta((args[0] as unknown) as string)
    
    return { type: "string", value: a } as StringValue;
}

export function println(this: any, args: Runtime[], scope: Environment){
    if(scope.simple != true) return makeNull();
    // deno-lint-ignore prefer-const
    let log: any[] = []

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

export function print(this: any, args: Runtime[], scope: Environment){
    if(scope.simple != false) return makeNull();
    // deno-lint-ignore prefer-const
    let log: any[] = []

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
    return makeNull();
}
function loop(args: Runtime[], scope: Environment){
    //if(!(args[1] as FunctionValue).body) throw "no function found in call";
    if((args[0] as NumberValue).value < 1) throw "minimum loop amouns shouldn't be under 1";
		const env = new Environment(scope);

		let result: Runtime = makeNull();
		for(let i = 0; i < (args[0] as NumberValue).value; i++){
            for (const Statement of (args[1] as FunctionValue).body) {
			result = evaluate(Statement, env);
		}
    }

		return result;
}

function wait(args: Runtime[], _scope: Environment){
    const value = (args[0] as NumberValue).value;
    execSync(`sleep ${value}`, {});
    return makeNull();
}
function ask(args: Runtime[] | string[], _scope: Environment){
    const data = prompt(args[0] as string);
    return { type: 'string', value: data } as StringValue;
}
function CreateBot(args: Runtime[], scope: Environment){
    const Token = { type: "string", value: (args.shift() as unknown) as string } as StringValue;
    scope.declareVar("DiscordBotToken", Token, true);
    const client: Client<true> = new Client({ intents: ["Guilds", "MessageContent", "GuildMessages", "GuildMembers"] });
    client.login(Token.value);
    memory['client'] = client;
    return makeNull();
}
function initready(_args: Runtime[], scope: Environment){
    memory['client']!.on('ready', (client) => {
        scope.declareVar("client", {
            type: 'object',
            properties: new Map<string, Runtime>().set("name", { type: 'string', value: client.user.username } as StringValue).set("id", { type: 'string', value: client.user.id } as StringValue).set("ping", { type: 'string', value: `${client.ws.ping}` } as StringValue)
        } as ObjectValue, true);
    })
    return makeNull();
}

function executeFunc(func: Statement[], scope: Environment){
    const env = new Environment(scope);

	let result: Runtime = makeNull();
    for (const Statement of func) {
		result = evaluate(Statement, env);
	}
    return result
}


function setupMsgFunc(func: Statement[], scope: Environment, message: Message<true>){
    const env = new Environment(scope);
    function sendMessage(args: Runtime[], _scope: Environment){
        if((args[0] as StringValue).value !== undefined){
            const b = (args[0] as StringValue).value;
            (message.channel as any).send(b).catch(() => {
                console.log("There was an error sending the message");
            });
            return makeNull();
        }
        (message.channel as any).send((args[0] as unknown) as string).catch(() => {
            console.log("There was an error sending the message");
        });
    
        return makeNull();
    }
    function sendDM(args: Runtime[], _scope: Environment){
        if((args[0] as StringValue).value !== undefined){
            const b = (args[0] as StringValue).value;
            (message.author as any).send(b).catch(() => {
                console.log("There was an error sending the DM");
            });
            return makeNull();
        }
        (message.author as any).send((args[0] as unknown) as string).catch(() => {
            console.log("There was an error sending the DM");
        });
    
        return makeNull();
    }
    function mentions_role(args: Runtime[], _scope: Environment){
        const index = (args[0] as NumberValue).value;
        const arr: Role[] = [];
        message.mentions.roles.map(a => {
            console.log(a);
            arr.push(a);
        })
        return { type: 'string', value: (arr[index] as unknown) as string } as StringValue;
    }
    env.declareVar("message", {
        type: 'object',
        properties: new Map<string, Runtime>()
        .set("content", { type: 'string', value: message.content } as StringValue)
        .set("mentions", {
            type: 'object',
            properties: new Map<string, Runtime>().set("roles", MK_NATIVE_FN(mentions_role))
        } as ObjectValue)
        .set("send", MK_NATIVE_FN(sendMessage))
    } as ObjectValue, true);
    env.declareVar("author", {
        type: 'object',
        properties: new Map<string, Runtime>()
        .set("username", { type: 'string', value: message.author.username } as StringValue)
        .set("globalname", { type: 'string', value: message.author.globalName } as StringValue)
        .set("id", { type: 'string', value: message.author.id } as StringValue)
        .set("dm", MK_NATIVE_FN(sendDM))
    } as ObjectValue, true);

	let result: Runtime = makeNull();
    for (const Statement of func) {
		result = evaluate(Statement, env);
	}
    return result
}

function whenMessageCreate(args: Runtime[], scope: Environment){
    memory['client']!.on('messageCreate', (messge:Message<boolean>) => {
        const message = messge as Message<true>;

        setupMsgFunc((args[0] as FunctionValue).body, scope, message);
    })
    return makeNull();
}

function whenReady(args: Runtime[], scope: Environment){
    memory['client']!.on("ready", () => {
        executeFunc((args[0] as FunctionValue).body, scope);
    })
    return makeNull();
}
const map = new Map<string, Runtime>();
map.set("out", MK_NATIVE_FN(print))
const map1 = new Map<string, Runtime>();
map1.set("ready", MK_NATIVE_FN(whenReady));
map1.set("init", MK_NATIVE_FN(initready));
map1.set("message", MK_NATIVE_FN(whenMessageCreate));

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
    env.declareVar("bot", MK_NATIVE_FN(CreateBot), true);
    env.declareVar("events", {
        type: 'object',
        properties: map1 
    } as ObjectValue, true);
    env.declareVar("system", {
		type: "object",
		properties: map
	} as ObjectValue, true);
}
