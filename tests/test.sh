#!/bin/bash
clear
nohup node ../src/flatwhite.js > /dev/null & 
nodeunit api/admin.js
nodeunit api/items.js
nodeunit api/files.js
nodeunit modules/auth.js
nodeunit modules/items.js
kill -9 `ps -aef | grep 'node ../src/flatwhite.js' | grep -v grep | awk '{print $2}'`