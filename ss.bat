@echo off

set File=

if not "%~1"=="" (
  set "File=%cd%\%~1"
)

    deno run -A main.ts