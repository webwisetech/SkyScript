import { run } from "../../../../../main.ts";
import Environment from "../../../../environment.ts";
import { Runtime,StringValue,makeNull } from "../../../../values.ts";

export default function(args: Runtime[], _scope: Environment){
    let file = "error";
    for(const arg of args){
        switch(arg.type){
            case "string":
                file = (arg as StringValue).value
            break;
            default:
                file = arg as unknown as string;
            break;
            
        }
    }
    run(file);

    return makeNull();
}