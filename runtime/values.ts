import Environment from "./environment.ts";
import { Stmt } from "../frontend/ast.ts";
export type ValueType =
	| "null"
	| "number"
	| "boolean"
	| "string"
	| "array"
	| "object"
	| "native-fn"
	| "function";

// deno-lint-ignore no-empty-interface
export interface RuntimeVal {}

export interface Runtime extends RuntimeVal{
	type: ValueType;
}

/**
 * Defines a value of undefined meaning
 */
export interface NullVal extends Runtime {
	type: "null";
	value: null;
}

export function MK_NULL() {
	return { type: "null", value: null } as NullVal;
}

export interface BooleanVal extends Runtime {
	type: "boolean";
	value: boolean;
}

export function MK_BOOL(b = true) {
	return { type: "boolean", value: b } as BooleanVal;
}

/**
 * Runtime value that has access to the raw native javascript number.
 */
export interface NumberVal extends Runtime {
	type: "number";
	value: number;
}

export function MK_NUMBER(n = 0) {
	return { type: "number", value: n } as NumberVal;
}

/**
 * Runtime value that has access to the raw native javascript number.
 */
export interface ObjectVal extends Runtime {
	type: "object";
	properties: Map<string, Runtime>;
}

export interface StringVal extends Runtime {
    type: 'string'
    value: string
}

export function MK_STR(str: string){
	return { type: "string", value: str } as StringVal;
}

export type FunctionCall = (args: Runtime[], env: Environment) => Runtime | StringVal;

export interface NativeFnValue extends Runtime {
	type: "native-fn";
	call: FunctionCall;
}
export function MK_NATIVE_FN(call: FunctionCall) {
	return { type: "native-fn", call } as NativeFnValue;
}

export interface FunctionValue extends Runtime {
	type: "function";
	name: string;
	parameters: string[];
	declarationEnv: Environment;
	body: Stmt[];
}

export interface ArrayVal extends Runtime {
	type: "array";
	elements: Runtime[];
}