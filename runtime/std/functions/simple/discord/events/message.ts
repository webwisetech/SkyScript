import { Message } from "npm:discord.js";
import Environment from "../../../../../environment.ts";
import { memory } from "../../../../../localDB/memory.ts";
import { Runtime,FunctionValue,makeNull } from "../../../../../values.ts";
import msgfun from "../utils/msgfun.ts";

export default function(args: Runtime[], scope: Environment){
    memory['client']!.on('messageCreate', (messge:Message<boolean>) => {
        const message = messge as Message<true>;

        msgfun((args[0] as FunctionValue).body, scope, message);
    })
    return makeNull();
}
