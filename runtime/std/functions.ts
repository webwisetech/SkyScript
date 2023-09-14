// deno-lint-ignore-file no-explicit-any
import { __dirname } from "../../main.ts";
import simple from './functions/simple/index.ts';
import Environment from "../environment.ts";
import { Runtime, NullValue, NumberValue, BooleanValue, StringValue, ObjectValue,MakeNativeFunc, makeNull, FunctionValue } from "../values.ts";
import * as util from 'node:util'; 
import { execSync } from 'https://deno.land/std@0.177.1/node/child_process.ts';
import colors from 'npm:colors';
import { evaluate } from "../interpreter.ts";
import { Client, Message, Role } from 'npm:discord.js';
import { memory } from '../localDB/memory.ts';
import { Statement } from "../../syntax/ast.ts";

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
            properties: new Map<string, Runtime>().set("roles", MakeNativeFunc(mentions_role))
        } as ObjectValue)
        .set("send", MakeNativeFunc(sendMessage))
    } as ObjectValue, true);
    env.declareVar("author", {
        type: 'object',
        properties: new Map<string, Runtime>()
        .set("username", { type: 'string', value: message.author.username } as StringValue)
        .set("globalname", { type: 'string', value: message.author.globalName } as StringValue)
        .set("id", { type: 'string', value: message.author.id } as StringValue)
        .set("dm", MakeNativeFunc(sendDM))
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
map.set("out", MakeNativeFunc(print))
const map1 = new Map<string, Runtime>();
map1.set("ready", MakeNativeFunc(whenReady));
map1.set("init", MakeNativeFunc(initready));
map1.set("message", MakeNativeFunc(whenMessageCreate));

export function stdfun(env: Environment){
    
    simple(env)
	env.declareVar("out", MakeNativeFunc(println), true);
    env.declareVar("wait", MakeNativeFunc(wait), true);
    env.declareVar("ask", MakeNativeFunc(ask), true);
    env.declareVar("mode", MakeNativeFunc(envMode), true);
    env.declareVar("loop", MakeNativeFunc(loop), true);
    
    env.declareVar("blue", MakeNativeFunc(blue), true);
    env.declareVar("green", MakeNativeFunc(green), true);
    env.declareVar("red", MakeNativeFunc(red), true);
    env.declareVar("yellow", MakeNativeFunc(yellow), true);
    env.declareVar("cyan", MakeNativeFunc(cyan), true);
    env.declareVar("magenta", MakeNativeFunc(magenta), true);
    env.declareVar("bot", MakeNativeFunc(CreateBot), true);
    env.declareVar("events", {
        type: 'object',
        properties: map1 
    } as ObjectValue, true);
    env.declareVar("system", {
		type: "object",
		properties: map
	} as ObjectValue, true);
}
