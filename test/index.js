var supermoon = require('../lib/supermoon');
var path = require('path');
var rimraf = require('rimraf');

var testPkg = require('./fixtures/test-package/package.json');

var conf = supermoon.conf = {
  tmpdir: path.join(__dirname, 'tmp'),
  cachedir: path.join(__dirname, 'packaged'),
  cwd: path.dirname(testPkg)
};

describe('supermoon', function () {

});