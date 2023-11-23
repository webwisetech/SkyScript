import { evaluate } from "../../runtime/index.js";
import Environment from "../../runtime/env.js";
import { Runtime, makeNull } from "../../runtime/val.js";
import { VarDeclaration } from "../../syntax/ast.js";

export function VariableDeclaration(
	declaration: VarDeclaration,
	env: Environment
): Runtime {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: makeNull();

	return env.declareVar(declaration.identifier, value, declaration.constant);
}