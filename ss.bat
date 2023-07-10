@echo off

set File=

where deno > nul 2>&1

if %errorlevel% equ 0 (
    if not "%~1"=="" (
  set "File=%cd%\%~1"
)

    deno run -A main.ts
) else (
    echo Deno is not installed, please install it and try again.
)