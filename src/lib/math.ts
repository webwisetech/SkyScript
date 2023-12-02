import Environment from "../runtime/env.js";
import { NumberValue, Runtime, StringValue } from "../runtime/val.js";

export default function({ library, makeNum: makeNumber, makeNull }) {
	library.createFunction("nnei", function(args: Runtime[], _scope: Environment){
		if(args[0] == undefined) throw "The nnei() Function requires input"
		const val = eval((args[0] as StringValue).value)
		 if(Number.isNaN(val)){
			return makeNull();
		 } else {
			return makeNumber(val);
		 }
	});

	library.createFunction("round", function(args, _scope){
		if(args[0] == undefined) throw "The round() Function requires input"
		const val = Math.round((args[0] as NumberValue).value)
		 if(Number.isNaN(val)){
			return makeNull();
		 } else {
			return makeNumber(val);
		 }
	});
};