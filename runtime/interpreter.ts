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
} from "../syntax/ast.ts";
import Environment from "./environment.ts";
import {
	evaluateFunctionDeclaration,
	evaluateIfStatement,
	evaluateProgram,
	evaluateVariableDeclaration,
} from "./eval/statements.ts";
import {
	evaluateAssignment,
	evaluateBinaryExpression,
	eval_callExpression,
	eval_equalityExpression,
	evaluateIdentifier,
	eval_memberExpression,
	evaluateObjectExpression,
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
			return evaluateIdentifier(astNode as Identifier, env);
		case "ObjectLiteral":
			return evaluateObjectExpression(astNode as ObjectLiteral, env);
		case "MemberExpression":
			return eval_memberExpression(astNode as MemberExpression, env);
		case "CallExpression":
			return eval_callExpression(astNode as CallExpression, env);
		case "AssignmentExpression":
			return evaluateAssignment(astNode as AssignmentExpression, env);
		case "BinaryExpression":
			return evaluateBinaryExpression(astNode as BinaryExpression, env);
		case 'EqualityExpression':
			return eval_equalityExpression(astNode as EqualityExpression, env);
		case 'IfStatement':
			return evaluateIfStatement(astNode as IfStatement, env)	
		case "Program":
			return evaluateProgram(astNode as Program, env);
		// Handle statements
		case "VarDeclaration":
			return evaluateVariableDeclaration(astNode as VarDeclaration, env);
		case "FunctionDeclaration":
			return evaluateFunctionDeclaration(astNode as FunctionDeclaration, env);
		// Handle unimplimented ast types as error.
		default:
			console.error(
				"This AST Node has not yet been setup for interpretation.\n",
				astNode
			);
			Deno.exit(0);
	}
}