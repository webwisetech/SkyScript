import { Statement } from "../../../../../../syntax/ast.ts";
import Environment from "../../../../../environment.ts";
import { evaluate } from "../../../../../interpreter.ts";
import { Runtime,makeNull } from "../../../../../values.ts";

export default function(func: Statement[], scope: Environment){

	let result: Runtime = makeNull();
    for (const Statement of func) {
		result = evaluate(Statement, scope);
	}
    return result
}