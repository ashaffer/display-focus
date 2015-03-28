#!/usr/bin/env node

var args = process.argv.slice(2);
var direction = args[0];

if(['left', 'right'].indexOf(direction) === -1) {
  console.log('Usage: display-focus <left/right>');
  process.exit(-1);
}

require('display-focus')(direction);