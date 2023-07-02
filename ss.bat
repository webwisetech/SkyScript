@echo off
IF "%*"=="" (
    echo No arguments provided.
    exit
)

set "File=%cd%\%1"

deno run -A main.ts