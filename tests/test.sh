#!/bin/bash
clear
nohup node ../src/flatwhite.js > /dev/null & 
nodeunit modules/auth.js
nodeunit api/admin.js
nodeunit modules/items.js
nodeunit api/items.js
kill -9 `ps -aef | grep 'node ../src/flatwhite.js' | grep -v grep | awk '{print $2}'`