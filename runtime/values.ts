import Environment from "./environment.ts";
import { Stmt } from "../frontend/ast.ts";
export type ValueType =
	| "null"
	| "number"
	| "boolean"
	| "string"
	| "object"
	| "native-fn"
	| "function";

export interface RuntimeVal {
	type: ValueType;
}

/**
 * Defines a value of undefined meaning
 */
export interface NullVal extends RuntimeVal {
	type: "null";
	value: null;
}

export function MK_NULL() {
	return { type: "null", value: null } as NullVal;
}

export interface BooleanVal extends RuntimeVal {
	type: "boolean";
	value: boolean;
}

export function MK_BOOL(b = true) {
	return { type: "boolean", value: b } as BooleanVal;
}

/**
 * Runtime value that has access to the raw native javascript number.
 */
export interface NumberVal extends RuntimeVal {
	type: "number";
	value: number;
}

export function MK_NUMBER(n = 0) {
	return { type: "number", value: n } as NumberVal;
}

/**
 * Runtime value that has access to the raw native javascript number.
 */
export interface ObjectVal extends RuntimeVal {
	type: "object";
	properties: Map<string, RuntimeVal>;
}

export interface StringVal extends RuntimeVal {
    type: 'string'
    value: string
}

export function MK_STR(str: string){
	return { type: "string", value: str } as StringVal;
}

export type FunctionCall = (args: RuntimeVal[], env: Environment) => RuntimeVal;

export interface NativeFnValue extends RuntimeVal {
	type: "native-fn";
	call: FunctionCall;
}
export function MK_NATIVE_FN(call: FunctionCall) {
	return { type: "native-fn", call } as NativeFnValue;
}

export interface FunctionValue extends RuntimeVal {
	type: "function";
	name: string;
	parameters: string[];
	declarationEnv: Environment;
	body: Stmt[];
}
