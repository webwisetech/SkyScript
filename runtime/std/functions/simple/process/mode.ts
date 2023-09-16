import Environment from "../../../../environment.ts";
import { Runtime,makeNull } from "../../../../values.ts";

type mode = 'simple' | 'advanced';
export default function(args: Runtime[], scope: Environment){
    switch((args[0] as unknown) as mode){
        case 'simple': {
            scope.simple = true;
        } break;
        case 'advanced': {
            scope.simple = false;
        } break;
    }
    return makeNull();
}