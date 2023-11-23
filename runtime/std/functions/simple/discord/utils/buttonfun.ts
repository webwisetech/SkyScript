import { ButtonInteraction, ComponentType } from "npm:discord.js";
import Environment from "../../../../../environment.ts";
import { Statement } from "../../../../../../syntax/ast.ts";
import { Runtime,MakeString,ObjectValue, MakeNativeFunc, makeNull, StringValue, DiscordEmbed } from "../../../../../values.ts";
import { evaluate } from "../../../../../interpreter.ts";
type vale = string | ComponentType;
export default function(interaction: ButtonInteraction, fun: Statement[], scope: Environment){
	const env = new Environment(scope);
	function sendinteraction(args: Runtime[], _scope: Environment){
        if((args[0] as StringValue).value !== undefined){
            const b = (args[0] as StringValue).value;
			const thing: Array<Record<string, vale>> = [];
			args.shift();
			args.forEach(arg => {
				if((arg as DiscordEmbed).prototype === "embed")
					thing.push((arg as DiscordEmbed).body);
				else
					return;
			});
            interaction.reply({ content: b, embeds: thing}).catch(() => {
                console.log("There was an error sending the interaction");
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
        interaction.reply({ content: b, embeds: thing}).catch(() => {
            console.log("There was an error sending the interaction");
        });
    
        return makeNull();
    }
    function sendDM(args: Runtime[], _scope: Environment){
        if((args[0] as StringValue).value !== undefined){
            const b = (args[0] as StringValue).value;
            interaction.user.send(b).catch(() => {
                console.log("There was an error sending the DM");
            });
            return makeNull();
        }
        interaction.user.send((args[0] as unknown) as string).catch(() => {
            console.log("There was an error sending the DM");
        });
    
        return makeNull();
    }
	env.declareVar("button", {
		type: 'object',
		properties: new Map<string, Runtime>()
		.set("id", MakeString(interaction.customId))
		.set("reply", MakeNativeFunc(sendinteraction))
		.set("dm", MakeNativeFunc(sendDM))
	} as ObjectValue, true);

	let result = makeNull();
	for(const stmt of fun){
		result = evaluate(stmt, env);
	}
	return result;
}
