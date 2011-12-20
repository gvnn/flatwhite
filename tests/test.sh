#!/bin/bash

clear

echo "starting flatwhite"
nohup node ../src/flatwhite.js > /dev/null & 

echo "running modules test"
nodeunit modules/auth.js

echo "running api tests"
nodeunit api/admin.js

echo "stop node"
kill -9 `ps -aef | grep 'node ../src/flatwhite.js' | grep -v grep | awk '{print $2}'`