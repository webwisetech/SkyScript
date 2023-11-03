#! /usr/bin/env node
import fs from 'fs';

const opts = process.argv;
opts.shift();opts.shift();
const [cmd, ...args] = opts;

async function cli(){
    switch(cmd){
        default:
                const file = args[0];
                if(!file.endsWith('.ss') || !file.endsWith('.skl') || !file.endsWith('.☁')) return;
    }
}