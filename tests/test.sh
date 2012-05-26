#!/bin/bash
clear
nodeunit api/admin.js
nodeunit api/items.js
nodeunit api/files.js
nodeunit modules/auth.js
nodeunit modules/items.js