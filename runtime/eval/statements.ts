import {
	FunctionDeclaration,
	IfStmt,
	Program,
	VarDeclaration,
} from "../../frontend/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { BooleanVal, FunctionValue, MK_NULL, NullVal, Runtime } from "../values.ts";

export function eval_program(program: Program, env: Environment): Runtime {
	let lastEvaluated: Runtime = MK_NULL();
	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}
	return lastEvaluated;
}

export function eval_var_declaration(
	declaration: VarDeclaration,
	env: Environment
): Runtime {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: MK_NULL();

	return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function eval_function_declaration(
	declaration: FunctionDeclaration,
	env: Environment
): Runtime {
	// Create new function scope
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue;

	return env.declareVar(declaration.name, fn, true);
}

export function eval_if_stmt(statement: IfStmt, env: Environment): Runtime {
    const conditional: Runtime = evaluate(statement.conditional, env)

    if (conditional.type == 'boolean') {
        const result = (conditional as BooleanVal)
        const runtimeVal = result as Runtime
        if (isTruthy(runtimeVal)) {
            if (Array.isArray(statement.consequent)) {
                // Evaluate each statement in the consequent array
                for (const consequentStatement of statement.consequent) {
                  evaluate(consequentStatement, env);
                }
            } else {
                // Evaluate the single consequent statement
                return evaluate(statement.consequent, env);
            }
        } else {
            if (statement.alternate) {
                if (Array.isArray(statement.alternate)) {
                    // Evaluate each statement in the alternate array
                    for (const alternateStatement of statement.alternate) {
                      evaluate(alternateStatement, env);
                    }
                } else {
                    // Evaluate the single alternate statement
                    return evaluate(statement.alternate, env);
                }
            }
        }
    } else {
        if (isTruthy(conditional)) {
            if (Array.isArray(statement.consequent)) {
              // Evaluate each statement in the consequent array
              for (const consequentStatement of statement.consequent) {
                evaluate(consequentStatement, env);
              }
            } else {
              // Evaluate the single consequent statement
              return evaluate(statement.consequent, env);
            }
        } else {
            if (statement.alternate) {
                if (Array.isArray(statement.alternate)) {
                    // Evaluate each statement in the alternate array
                    for (const alternateStatement of statement.alternate) {
                      evaluate(alternateStatement, env);
                    }
                } else {
                    // Evaluate the single alternate statement
                    return evaluate(statement.alternate, env);
                }
            }
        }
    }
      
    return { type: 'null', value: null } as NullVal
}

function isTruthy(conditional: Runtime) {
    if (conditional.type == 'boolean') {
        const bool = (conditional as BooleanVal).value
        if (bool) return true
        else return false
    }

    if (conditional) {
        return true
    } else {
        return false
    }
}