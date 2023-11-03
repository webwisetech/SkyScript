import { evaluate } from "../../runtime";
import Environment from "../../runtime/env";
import { Runtime } from "../../runtime/val";
import { AssignmentExpression, Identifier } from "../../syntax/ast";
import { SkyScriptErr } from "../../util/error";

export function Assignment(
	node: AssignmentExpression,
	env: Environment
): Runtime {
	if (node.assigne.kind !== "Identifier") {
		throw new SkyScriptErr("Invalid assignment - "+node.assigne);
	}

	const varname = (node.assigne as Identifier).symbol;
	return env.assignVar(varname, evaluate(node.value, env));
}