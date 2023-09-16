import { Client } from "npm:discord.js";
import Environment from "../../../../environment.ts";
import { memory } from "../../../../localDB/memory.ts";
import { Runtime,StringValue,makeNull } from "../../../../values.ts";

export default function(args: Runtime[], scope: Environment){
    const Token = { type: "string", value: (args.shift() as unknown) as string } as StringValue;
    scope.declareVar("DiscordBotToken", Token, true);
    const client: Client<true> = new Client({ intents: ["Guilds", "MessageContent", "GuildMessages", "GuildMembers"] });
    client.login(Token.value);
    memory['client'] = client;
    return makeNull();
}