var fs = require('graceful-fs');
var path = require('path');
var crypto = require('crypto');
var utils = module.exports;

module.exports.getHomeDir = function () {
  var envHome = process.platform === 'win32' ?
    'USERPROFILE' : 'HOME'
  return process.env[envHome];
};

module.exports.getRegistry = function () {
  var npmrc = path.join(utils.getHomeDir(), '.npmrc');
  if (!fs.existsSync(npmrc)) return;
  return (fs.readFileSync(npmrc).toString()
    .match(/^registry\s*=\s*(.+)/gmi) || [])[1]
};

module.exports.getPackageListFromPackageJson = function (packageJson) {
  var packageJsonObject;
  try {
    packageJsonObject = JSON.parse(fs.readFileSync(packageJson));
  } catch (e) {
    if (e instanceof TypeError) {
      console.error('No such file: %s', packageJson)
    } else {
      console.error('Error parsing JSON: %s', packageJson)
    }
    process.exit(-1);
  }

  return {
    dependencies: packageJsonObject.dependencies || {},
    devDependencies: packageJsonObject.devDependencies || {}
  };
};

module.exports.encodeURI = function (url) {
  return url.replace(/[\:\/\\\+@#]/g, '_');
};
