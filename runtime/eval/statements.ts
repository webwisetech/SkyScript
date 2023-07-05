import {
	FunctionDeclaration,
	Program,
	VarDeclaration,
} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { FunctionValue, MK_NULL, Runtime } from "../values.ts";

export function eval_program(program: Program, env: Environment): Runtime {
	let lastEvaluated: Runtime = MK_NULL();
	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}
	return lastEvaluated;
}

export function eval_var_declaration(
	declaration: VarDeclaration,
	env: Environment
): Runtime {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: MK_NULL();

	return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function eval_function_declaration(
	declaration: FunctionDeclaration,
	env: Environment
): Runtime {
	// Create new function scope
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue;

	return env.declareVar(declaration.name, fn, true);
}
