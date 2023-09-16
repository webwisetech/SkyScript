import { Client } from "../../../../../../../../../AppData/Local/deno/npm/registry.npmjs.org/undici/5.22.1/index.js";
import Environment from "../../../../../environment.ts";
import { memory } from "../../../../../localDB/memory.ts";
import { Runtime,StringValue,ObjectValue,FunctionValue,makeNull } from "../../../../../values.ts";
import exec from '../utils/exec.ts';

export default function(args: Runtime[], scope: Environment){
    memory['client']!.on("ready", (client: Client<true>) => {
        const env = new Environment(scope);
        env.declareVar("client", {
            type: 'object',
            properties: new Map<string, Runtime>().set("name", { type: 'string', value: client.user.username } as StringValue).set("id", { type: 'string', value: client.user.id } as StringValue).set("ping", { type: 'string', value: `${client.ws.ping}` } as StringValue)
        } as ObjectValue, true);
        memory["client"] = client;
        exec((args[0] as FunctionValue).body, env);
    })
    return makeNull();
}