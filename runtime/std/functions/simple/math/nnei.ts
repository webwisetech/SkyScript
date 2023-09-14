import Environment from "../../../../environment.ts";
import { Runtime,StringValue,makeNull } from "../../../../values.ts";

export default function(args: Runtime[], _scope: Environment){
    if(args[0] == undefined) throw "The nnei() Function requires input"
    console.log(eval((args[0] as StringValue).value))
    return makeNull(); 
}