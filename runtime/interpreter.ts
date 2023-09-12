import { NumberValue } from "./values.ts";
import {
	AssignmentExpression,
	BinaryExpression,
	CallExpression,
	EqualityExpression,
	FunctionDeclaration,
	Identifier,
	IfStatement,
	MemberExpression,
	NumericLiteral,
	ObjectLiteral,
	Program,
	Statement,
	StringLiteral,
	VarDeclaration,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import {
	eval_function_declaration,
	eval_if_Statement,
	evaluateProgram,
	eval_var_declaration,
} from "./eval/statements.ts";
import {
	eval_assignment,
	eval_binaryExpression,
	eval_callExpression,
	eval_equalityExpression,
	eval_identifier,
	eval_memberExpression,
	eval_objectExpression,
} from "./eval/expressions.ts";
// Runtime | StringVal
// deno-lint-ignore no-explicit-any
export function evaluate(astNode: Statement, env: Environment): any {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberValue;
		case 'StringLiteral':
			return (astNode as StringLiteral).value;
		case "Identifier":
			return eval_identifier(astNode as Identifier, env);
		case "ObjectLiteral":
			return eval_objectExpression(astNode as ObjectLiteral, env);
		case "MemberExpression":
			return eval_memberExpression(astNode as MemberExpression, env);
		case "CallExpression":
			return eval_callExpression(astNode as CallExpression, env);
		case "AssignmentExpression":
			return eval_assignment(astNode as AssignmentExpression, env);
		case "BinaryExpression":
			return eval_binaryExpression(astNode as BinaryExpression, env);
		case 'EqualityExpression':
			return eval_equalityExpression(astNode as EqualityExpression, env);
		case 'IfStatement':
			return eval_if_Statement(astNode as IfStatement, env)	
		case "Program":
			return evaluateProgram(astNode as Program, env);
		// Handle statements
		case "VarDeclaration":
			return eval_var_declaration(astNode as VarDeclaration, env);
		case "FunctionDeclaration":
			return eval_function_declaration(astNode as FunctionDeclaration, env);
		// Handle unimplimented ast types as error.
		default:
			console.error(
				"This AST Node has not yet been setup for interpretation.\n",
				astNode
			);
			Deno.exit(0);
	}
}