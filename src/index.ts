#! /usr/bin/env node
import Parser from './syntax/parser.js';
import { createGlobalEnv } from './runtime/env.js';
import { evaluate } from './runtime/index.js';
import _colors from 'colors';
import fs from 'fs'; 
import { SkyScriptWarn } from "./util/warn.js";
import { Library } from './lib/index.js';
import yml from 'yaml'
import { SkyScriptErr } from './util/error.js';
import { Lexer } from './syntax/lexer.js';

function readFile(input){
    if(!fs.existsSync(input))
    new SkyScriptErr("Can't open "+input);
    return fs.readFileSync(input).toString();
}

interface Codebase {
    os: {
        name: string;
        cpu: {
            minUsage: number;
            maxUsage: number;
            resS: {
                cores: number;
                threads: number;
            }
        }
    }
    code: {
        encoding: "hex" | "base64",
        code?: string;
    },
    executable: {
        isExecutable: boolean;
        ext: string[];
        requirements: string[];
        tests: string[];
    }
}

const codebase: Codebase = {
    os: {
        name: "SkyScriptVM",
        cpu: {
            minUsage: 0.20,
            maxUsage: 40.8,
            resS: {
                cores: 1,
                threads: 1
            }
        }
    },
    code: {
        encoding: "hex",
    },

    executable: {
        isExecutable: true,
        ext: ["skx"],
        requirements: ["node", "npm", "ss"],
        tests: [
            "darwin",
            "linux",
            "win64"
        ]
    }
    
}

export function build(path: string){
    const lexer = new Lexer();
    const parser = new Parser();
    const input = lexer.Tokenize(readFile(path));
    const program = parser.createAST(input);
    codebase.code["code"] = JSON.stringify(program);
    const buf =Buffer.from(JSON.stringify(codebase)).toString("hex");
    fs.writeFileSync("output.skx", buf);
}

export async function run(path: string ,debug?: boolean){
    const lexer = new Lexer();
    const parser = new Parser();
    const json = yml.parse(readFile("ss.yml"));
    const lib = new Library(json.packages);
    const env = lib.env;
    await lib.registerPacks().then(() => {
        const input = lexer.Tokenize(readFile(path));
        const program = parser.createAST(input);
        const result = evaluate(program, env);
        if(debug)
            console.log(result)
    })
}

export async function runmain(args: string[], path: string){
    const file = args.shift()
    const lexer = new Lexer()
    if(!file?.endsWith(".ss")) throw "file is not a .ss skyscript file";
    try{
    const parser = new Parser();
    const env = createGlobalEnv();
    const input = lexer.Tokenize(readFile(path));
    const program = parser.createAST(input);
    const buf =Buffer.from(JSON.stringify(program)).toString("hex");
    fs.writeFileSync("output.skx", buf);
    /*const result =*/ //evaluate(program, env);
    //console.log(result)
    } catch(e: any) {
        new SkyScriptWarn(e);
    }
}
/*
export function repl(){
    let DebugMode = false;
    const parser = new Parser();
    const env = createGlobalEnv();
    console.log("Sky"+_colors.cyan("Script"), "REPL v0.0.4-a");
    while(true){
        const input = prompt(_colors.green("> "));

        if(!input){
            continue
        }else if(input == "/exit"){
            console.log(_colors.red("exiting"));
            process.exit(1);
        } else if(input == "/debug"){
            DebugMode = !DebugMode;
            console.log(_colors.yellow("Toggled Debug mode!"));
        } else if(input == "/help"){
            console.log("All commands: \n- /exit: exit the repl\n- /debug: enable debug mode\n- /help: shows this menu")
        }else{
            const program = parser.createAST(input);

        if(DebugMode){
            console.log(program);
        } else {
            /*const result =evaluate(program, env);
            //console.log(result)
        }
        }
    }
}*/