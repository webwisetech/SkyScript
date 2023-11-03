import { evaluate } from "../../runtime";
import Environment from "../../runtime/env";
import { Runtime, ArrayValue } from "../../runtime/val";
import { ArrayLiteral } from "../../syntax/ast";

export function Arrays(
	arr: ArrayLiteral,
	env: Environment
): Runtime[] {
	const array = { type: "array", elements: [] as Runtime[] } as ArrayValue;

	for(const { value } of arr.elements){
		const Runtime =
			value == undefined ? env.lookupVar(value) : evaluate(value, env);
		if(Runtime.value !== undefined)
			array.elements.push(Runtime.value);
		else
			array.elements.push(Runtime);
	}

	return array.elements
}