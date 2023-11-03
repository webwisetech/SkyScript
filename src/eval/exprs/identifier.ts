import Environment from "../../runtime/env";
import { Runtime } from "../../runtime/val";
import { Identifier } from "../../syntax/ast";

export function EIdentifier(
	ident: Identifier,
	env: Environment
): Runtime {
	const val = env.lookupVar(ident.symbol);
	return val;
}