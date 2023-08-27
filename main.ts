import Parser from './frontend/parser.ts';
import { createGlobalEnv } from './runtime/environment.ts';
import { evaluate } from './runtime/interpreter.ts';
import * as nodepath from "https://deno.land/std@0.110.0/node/path/posix.ts";
import * as denopath from "https://deno.land/std@0.188.0/path/mod.ts";
import _colors from 'npm:colors';

const __filename = denopath.fromFileUrl(import.meta.url);
const __dirname = denopath.dirname(denopath.fromFileUrl(import.meta.url))

const file = Deno.args[0];

if(file === "-v" || file === "--version"){
    console.log("Sky"+_colors.blue("Script"), "is on version: 0.0.4-a");
    Deno.exit(0);
}

if(file != undefined){
   runmain(`${file}`);
} else {
    repl();
}

export async function run(path: string){
    if(!file?.endsWith(".ss")) throw "file is not a .ss skyscript file";
    const parser = new Parser();
    const env = createGlobalEnv();
    const input = await Deno.readTextFile(nodepath.join(__dirname, path));
    const program = parser.produceAST(input);
    /*const result =*/ evaluate(program, env);
    // console.log(result)
}

async function runmain(path: string){
    if(!file?.endsWith(".ss")) throw "file is not a .ss skyscript file";
    try{const parser = new Parser();
    const env = createGlobalEnv();
    const input = await Deno.readTextFile(path);
    const program = parser.produceAST(input);
    /*const result =*/ evaluate(program, env);
    //console.log(result)
    } catch(e) {
        console.log(e)
    }
}

function repl(){
    let DebugMode = false;
    const parser = new Parser();
    const env = createGlobalEnv();
    console.log("Sky"+_colors.blue("Script"), "REPL v0.0.4-a");
    while(true){
        const input = prompt(_colors.green("> "));

        if(!input){
            continue
        }else if(input == "/exit"){
            console.log("exiting");
            Deno.exit(1);
        } else if(input == "/debug"){
            DebugMode = !DebugMode;
            console.log("Toggled Debug mode!");
        } else if(input == "/help"){
            console.log("All commands: \n- /exit: exit the repl\n- /debug: enable debug mode\n- /help: shows this menu")
        }else{
            const program = parser.produceAST(input);

        if(DebugMode){
            console.log(program);
        } else {
            /*const result =*/ evaluate(program, env);
            //console.log(result)
        }
        }
    }
}