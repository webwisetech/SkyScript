import { NumberVal, RuntimeVal } from "./values.ts";
import { BinaryExpression, NumericLiteral, Program, Stmt, Identifier, VarDeclaration, AssignmentExpr } from "../frontend/ast.ts";
import Environment from "./env.ts";
import { eval_identifier,eval_binary_expr, eval_assignment, eval_object_expr } from "./eval/expressions.ts";
import { eval_program, eval_var_declaration } from "./eval/statements.ts";

export function evaluate(astNode: Stmt, env: Environment): RuntimeVal {
  switch (astNode.kind) {
    case "NumericLiteral":
      return {
        value: ((astNode as NumericLiteral).value),
        type: "number",
      } as NumberVal;
    case "Identifier":
      return eval_identifier(astNode as Identifier, env);
    case "AssignmentExpr":
      return eval_assignment(astNode as AssignmentExpr, env);
    case "ObjectLiteral":
      return eval_object_expr(astNode as ObjectLiteral, env);
    case "BinaryExpression":
      return eval_binary_expr(astNode as BinaryExpression, env);
    case "Program":
      return eval_program(astNode as Program, env);
    case "VarDeclaration":
      return eval_var_declaration(astNode as VarDeclaration, env);
    default:
      console.error(
        "This AST Node has not yet been setup for interpretation.",
        astNode,
      );
      Deno.exit(0);
  }
}