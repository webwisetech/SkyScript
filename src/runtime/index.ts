import { NumberValue } from "./val.js";
import {
ArrayLiteral,
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
} from "../syntax/ast.js";
import Environment from "./env.js";
import * as eval from "../eval/index.js";
import { SkyScriptErr } from "../util/error.js";
// deno-lint-ignore no-explicit-any
export function evaluate(astNode: Statement, env: Environment): any {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberValue;
		case "ArrayLiteral":
			return eval.Arrays(astNode as ArrayLiteral, env)
		case 'StringLiteral':
			return (astNode as StringLiteral).value;
		case "Identifier":
			return eval.EIdentifier(astNode as Identifier, env);
		case "ObjectLiteral":
			return eval.ObjectExpression(astNode as ObjectLiteral, env);
		case "MemberExpression":
			return eval.MemberExpr(astNode as MemberExpression, env);
		case "CallExpression":
			return eval.CallExpr(astNode as CallExpression, env);
		case "AssignmentExpression":
			return eval.Assignment(astNode as AssignmentExpression, env);
		case "BinaryExpression":
			return eval.BinaryExpression(astNode as BinaryExpression, env);
		case 'EqualityExpression':
			return eval.EqualityExpr(astNode as EqualityExpression, env);
		case 'IfStatement':
			return eval.IfStmt(astNode as IfStatement, env)	
		case "Program":
			return eval.SProgram(astNode as Program, env);
		
		case "VarDeclaration":
			return eval.VariableDeclaration(astNode as VarDeclaration, env);
		case "FunctionDeclaration":
			return eval.FunDeclaration(astNode as FunctionDeclaration, env);
		
		default:
            new SkyScriptErr("This AST Node has not yet been setup for interpretation.\n"+astNode);
	}
}