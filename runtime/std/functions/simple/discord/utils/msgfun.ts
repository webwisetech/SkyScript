// deno-lint-ignore-file no-explicit-any
import { Message, Role, Client } from "npm:discord.js";
import { Statement } from "../../../../../../syntax/ast.ts";
import Environment from "../../../../../environment.ts";
import { evaluate } from "../../../../../interpreter.ts";
import { Runtime,StringValue,makeNull,NumberValue,MakeNativeFunc,ObjectValue, DiscordEmbed } from "../../../../../values.ts";
import { memory } from "../../../../../localDB/memory.ts";

export default function(func: Statement[], scope: Environment, message: Message<true>){
	const client: Client<true> = memory["client"]!;
    const env = new Environment(scope);
    function sendMessage(args: Runtime[], _scope: Environment){
        if((args[0] as StringValue).value !== undefined){
            const b = (args[0] as StringValue).value;
			const thing: Array<Record<string, string>> = [];
			args.shift();
			args.forEach(arg => {
				if((arg as DiscordEmbed).prototype === "embed")
					thing.push((arg as DiscordEmbed).body);
				else
					return;
			});
            (message.channel as any).send({ content: b, embeds: thing}).catch(() => {
                console.log("There was an error sending the message");
            });
            return makeNull();
        }
		const b = (args[0] as unknown) as string;
		const thing: Array<Record<string, string>> = [];
		args.shift();
		args.forEach(arg => {
			if((arg as DiscordEmbed).prototype === "embed")
				thing.push((arg as DiscordEmbed).body);
			else
				return;
		});
        (message.channel as any).send({ content: b, embeds: thing}).catch(() => {
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
	env.declareVar("client", {
		type: 'object',
		properties: new Map<string, Runtime>().set("name", { type: 'string', value: client.user.username } as StringValue).set("id", { type: 'string', value: client.user.id } as StringValue).set("ping", { type: 'string', value: `${client.ws.ping}` } as StringValue)
	} as ObjectValue, true);

	let result: Runtime = makeNull();
    for (const Statement of func) {
		result = evaluate(Statement, env);
	}
    return result
}