#! /usr/bin/env node
import fs from 'fs';
import { SkyScriptErr } from './util/error.js';
import { run } from './index.js';

const opts = process.argv;
opts.shift();opts.shift();
const args = opts;
const cmd = args[0];
function launchProfile(accessToken?){
    const lines = {
        homeScreen: [
            "Welcome to SkyScript's Profile system!",
            "",
            "[1] Append access token",
            "[2] Download package",
            "[3] Post package",
            "[4] Delete package"
        ],
        packages: [
            "Package Chooser",
            "",
        ],
        post: [
            "Package Posting utility",
            ""
        ],
        access: [
            "Login - Access Token",
            "",
            "You need to specify both the mirror and "
        ]
    }
}

async function parseArgs(){
    const options = {
        debug: false
    };
    args.forEach(arg => {
        if(["-v", "--version"].includes(arg)){
            console.log("SkyScript is on version: v1.1.0")
            process.exit(0);
        } else if(["-d", "--debug"].includes(arg)){
            options["debug"] = true;
        }
    })
    return options;
}

async function cli(){
    await parseArgs().then(options => {
        switch(cmd){
            case "profile":
                launchProfile();
            default:
                run(cmd, options["debug"])
        }
    });
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