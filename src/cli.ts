#! /usr/bin/env node
import fs from 'fs';
import { SkyScriptErr } from './util/error.js';
import { build, run } from './index.js';

const opts = process.argv;
opts.shift();opts.shift();
const args = opts;
const cmd = args[0];

run("main.ss")

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