#!/usr/bin/env node

var args = process.argv.slice();
if(args[0] === 'node')
  args.shift();
var direction = args[1];
require('display-focus')(direction);