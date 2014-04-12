#!/usr/bin/env node

var args = process.argv.slice();
if(args[0] === 'node')
  args.shift();
var direction = args[1];

if(['left', 'right'].indexOf(direction) === -1) {
  console.log('Usage: display-focus <left/right>');
  process.exit(-1);
}

require('display-focus')(direction);