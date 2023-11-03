import { evaluate } from "../../runtime";
import Environment from "../../runtime/env";
import { Runtime, ObjectValue } from "../../runtime/val";
import { ObjectLiteral } from "../../syntax/ast";

export function ObjectExpression(
	obj: ObjectLiteral,
	env: Environment
): Runtime {
	const object = { type: "object", properties: new Map() } as ObjectValue;
	for (const { key, value } of obj.properties) {
		const Runtime =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, Runtime);
	}

	return object;
}