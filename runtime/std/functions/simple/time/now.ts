import Environment from "../../../../environment.ts";
import { Runtime, MakeNum } from "../../../../values.ts";

export default function(_args: Runtime[], _env: Environment) {
    return MakeNum(Date.now());
}