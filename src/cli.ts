#! /usr/bin/env node
import fs from 'fs';
import { SkyScriptErr } from './util/error.js';
import { run } from './index.js';

const opts = process.argv;
opts.shift();opts.shift();
const [cmd, ...args] = opts;

function parseArgs(){
    for(const arg in args){
        if(["-v", "--version"].includes(arg)){
            console.log("SkyScript is on version: ")
        }
    }
}

async function cli(){
    switch(cmd){
        default:
                const file = cmd;
                run(cmd)
    }
}

cli()

/*
const [node_exec, ss_path, file, ...args] = process.argv;

if(file === "-v" || file === "--version"){
    console.log("Sky"+_colors.cyan("Script"), "is on version: 0.0.4-a");
    process.exit(0);
}

if(file != undefined){
   runmain(`${file}`);
} else {
    repl();
}*/