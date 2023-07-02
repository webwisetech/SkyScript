import { AssignmentExpr, BinaryExpression,Identifier } from "../../frontend/ast.ts";
import Environment from "../env.ts";
import { evaluate } from "../interpeter.ts";
import { NumberVal,RuntimeVal,MK_NULL } from "../values.ts";

export function eval_numeric_binary_expr(
    lhs: NumberVal,
    rhs: NumberVal,
    operator: string,
  ): NumberVal {
    let result: number;
    if (operator == "+") {
      result = lhs.value + rhs.value;
    } else if (operator == "-") {
      result = lhs.value - rhs.value;
    } else if (operator == "*") {
      result = lhs.value * rhs.value;
    } else if (operator == "/") {
      // TODO: Division by zero checks
      result = lhs.value / rhs.value;
    } else {
      result = lhs.value % rhs.value;
    }
  
    return { value: result, type: "number" };
  }
  
export function eval_binary_expr(binop: BinaryExpression, env: Environment): RuntimeVal {
    const lhs = evaluate(binop.left, env);
    const rhs = evaluate(binop.right, env);
  
    if (lhs.type == "number" && rhs.type == "number") {
      return eval_numeric_binary_expr(
        lhs as NumberVal,
        rhs as NumberVal,
        binop.operator,
      );
    }
  
    return MK_NULL();
  }
  
export function eval_identifier(ident: Identifier, env: Environment): RuntimeVal {
    const val = env.lookupVar(ident.symbol);
    return val
  }
export function eval_assignment(node: AssignmentExpr, env: Environment): RuntimeVal {
  if(node.assigne.kind != "Identifier")
  throw `assigning a value to a number is impossible`;

  const varname = (node.assigne as Identifier).symbol;
  return env.assignVar(varname, evaluate(node.value, env));
}