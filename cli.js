#!/usr/bin/env node

var supermoon = require('./lib/supermoon');
var pkg = require('./package.json');

var argv = require('minimist')(process.argv.slice(2));
var command = argv._.shift();
var packages = argv._ || [];

var commands = ['install'];

function version () {
  console.log('%s %s', pkg.name, pkg.version);
}

function usage () {
  console.log(
    '\n' +
    'usage: supermoon <command> [package(s)]\n' +
    '\n' +
    'where <command> is one of:\n' + 
    '    %s', commands.join('    \n'));
}

if (argv.version || argv.v) return version();
if (argv.help || argv.h) return usage();

command = (commands.filter(function (c) {
  return c === command;
}) || [])[0];

if (!command) return usage();

if (command === 'install') {
  var start = process.hrtime();
  supermoon.install(packages, argv, function () {
    var end = process.hrtime(start);
    end = end[0] * 1E3 + end[1] / 1E6;
    console.log('Done in %s ms!', end.toFixed(3));
  });
}
