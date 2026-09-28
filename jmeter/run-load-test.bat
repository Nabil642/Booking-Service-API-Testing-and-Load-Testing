@echo off
REM Runs the Restful-Booker load test in non-GUI mode and builds the HTML dashboard.
REM Usage: run-load-test.bat [users] [rampup_seconds] [loops]
cd /d "%~dp0"

set USERS=%1
if "%USERS%"=="" set USERS=5
set RAMPUP=%2
if "%RAMPUP%"=="" set RAMPUP=10
set LOOPS=%3
if "%LOOPS%"=="" set LOOPS=2

if exist results rmdir /s /q results
mkdir results

jmeter -n -t restful-booker-load-test.jmx -Jusers=%USERS% -Jrampup=%RAMPUP% -Jloops=%LOOPS% -l results\results.jtl -e -o results\report

echo Open jmeter\results\report\index.html to see the dashboard
