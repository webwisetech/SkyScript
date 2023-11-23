import Environment from "../../../../environment.ts";
import { Runtime, ObjectValue, DiscordEmbed, StringValue } from "../../../../values.ts";

export default function(args: Runtime[], _scope: Environment){
	// deno-lint-ignore no-explicit-any
	const embed: Record<any, any> = {}
	if(args[0] !== undefined)
		embed["title"] = (args[0] as unknown as string);
	if(args[1] !== undefined)
		if((args[1] as StringValue).value !== undefined)
		embed["description"] = ((args[1] as StringValue).value);
		else
		embed["description"] = (args[1] as unknown as string);
	if(args[2] !== undefined){
		const name = (args[2] as ObjectValue).properties.get("name") as unknown as string;
		const iconURL = (args[2] as ObjectValue).properties.get("icon") as unknown as string;
		if(name){
			if(iconURL)
				embed["author"] = {
					name,
					iconURL
				};
			else
				embed["author"] = {
					name,
				};
		}
	}
	return {
		type: "component",
		prototype: "embed",
		body: embed,
	} as DiscordEmbed;
}