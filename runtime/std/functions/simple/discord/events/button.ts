import { BaseInteraction } from "npm:discord.js";
import Environment from "../../../../../environment.ts";
import { memory } from "../../../../../localDB/memory.ts";
import { Runtime, FunctionValue } from "../../../../../values.ts";
import buttonfun from "../utils/buttonfun.ts";

export default function(args: Runtime[], scope: Environment){
	memory["client"]!.on("interactionCreate", (interaction: BaseInteraction) => {
		if(!interaction.isButton()) return;

		buttonfun(interaction, (args[0] as FunctionValue).body, scope);
	})
}