import Environment from "../../../../environment.ts";
import { evaluate } from "../../../../interpreter.ts";
import { Runtime,NumberValue,makeNull,FunctionValue } from "../../../../values.ts";

export default function(args: Runtime[], scope: Environment){
    //if(!(args[1] as FunctionValue).body) throw "no function found in call";
    if((args[0] as NumberValue).value < 1) throw "minimum loop amouns shouldn't be under 1";
		const env = new Environment(scope);

		let result: Runtime = makeNull();
		for(let i = 0; i < (args[0] as NumberValue).value; i++){
            for (const Statement of (args[1] as FunctionValue).body) {
			result = evaluate(Statement, env);
		}
    }

		return result;
}