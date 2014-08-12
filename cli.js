#!/usr/bin/env node

var supermoon = require('./lib/supermoon');

var argv = require('minimist')(process.argv.slice(2));
var command = argv._.shift();
var packages = argv._ || [];

var commands = ['install'];

function usage () {
  console.log(
    '\n' +
    'usage: supermoon <command> [package(s)]\n' +
    '\n' +
    'where <command> is one of:\n' + 
    '    %s', commands.join('    \n'));
}

command = (commands.filter(function (c) {
  return c === command;
}) || [])[0];

if (!command) return usage();

if (command === 'install') {
  supermoon.install(packages, argv);
}
