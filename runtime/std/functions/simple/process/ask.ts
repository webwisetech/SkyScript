import Environment from "../../../../environment.ts";
import { Runtime,StringValue } from "../../../../values.ts";

export default function(args: Runtime[] | string[], _scope: Environment){
    const data = prompt(args[0] as string);
    return { type: 'string', value: data } as StringValue;
}