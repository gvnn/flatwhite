#!/bin/bash
clear
nohup node ../src/flatwhite.js > /dev/null & 
nodeunit modules/auth.js
nodeunit api/admin.js
kill -9 `ps -aef | grep 'node ../src/flatwhite.js' | grep -v grep | awk '{print $2}'`