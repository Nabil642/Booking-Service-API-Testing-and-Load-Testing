#!/usr/bin/env bash
# Runs the Restful-Booker load test in non-GUI mode and builds the HTML dashboard.
# Usage: ./jmeter/run-load-test.sh [users] [rampup_seconds] [loops]
set -e
cd "$(dirname "$0")"

USERS=${1:-3}
RAMPUP=${2:-6}
LOOPS=${3:-2}

rm -rf results
mkdir -p results

jmeter -n -t restful-booker-load-test.jmx \
  -Jusers=$USERS -Jrampup=$RAMPUP -Jloops=$LOOPS \
  -l results/results.jtl -e -o results/report

echo "Open jmeter/results/report/index.html to see the dashboard"
