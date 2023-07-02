import { MK_BOOL, MK_NULL, MK_NUM } from './runtime/values.ts';
import Parser from './frontend/parser.ts';
import Environment from './runtime/env.ts';
import { evaluate } from './runtime/interpeter.ts';

repl();

function repl(){
    let DebugMode = false;
    const parser = new Parser();
    const env = new Environment();
    env.declareVar("x", MK_NUM(100), true);
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);
    console.log("SkyScript REPL v0.0.1");
    while(true){
        const input = prompt("> ");

        if(!input){
            console.log("no input, exiting...");
            Deno.exit(1);
        }else if(input == "/exit"){
            console.log("exiting");
            Deno.exit(1);
        } else if(input == "/debug"){
            DebugMode = !DebugMode;
            console.log("Toggled Debug mode!");
        } else{
            const program = parser.produceAST(input);

        if(DebugMode){
            console.log(program);
        } else {
            const result = evaluate(program, env);
            console.log(result)
        }
        }
    }
}