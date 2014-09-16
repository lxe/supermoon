var rc = require('rc');
var async = require('async');
var path = require('path');
var fs = require('fs');
var cprf = require('cprf');
var semver = require('semver');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var spawn = require('child_process').spawn;
var pkg = require('../package.json');
var utils = require('./utils');

var conf = module.exports.conf = rc(pkg.name, {
  registry: utils.getRegistry() || 'https://registry.npmjs.org',
  tmpdir: path.join(utils.getHomeDir(), '.supermoon/tmp'),
  cachedir: path.join(utils.getHomeDir(), '.supermoon/packages'),
  link: false
});

function cleanup () {
  var files = fs.readdirSync(conf.tmpdir);
  if (!files || !files.length) return;
  process.stdout.write('Cleaning up...');
  files.forEach(function (file) {
    rimraf.sync(path.join(conf.tmpdir, file));
  });
  console.log('done!'); 
}

var cwd = conf.cwd || process.cwd();

var registries = 
  conf.registries = 
  conf.registries || [conf.registry];

if (!fs.existsSync(conf.cachedir)) mkdirp.sync(conf.cachedir);
if (!fs.existsSync(conf.tmpdir)) mkdirp.sync(conf.tmpdir);

module.exports.install = function install (packages, options, done) {
  cleanup();

  if (!packages || !packages.length) {
    var currentPackageJSON = path.join(cwd, 'package.json');
    return _installPackageJsonPackages(
      utils.getPackageListFromPackageJson(currentPackageJSON), 
      path.join(cwd, 'node_modules'), 
      options, 
      done);
  }
};

function _installPackageJsonPackages (deps, where, options, done) {
  var neededDependencies = deps.dependencies;
  if (!options.production && deps.devDependencies) 
    for (name in deps.devDependencies)
      neededDependencies[name] = deps.devDependencies[name];

  if (!fs.existsSync(where)) mkdirp.sync(where);

  async.each(Object.keys(neededDependencies), function (name, done) {
    var version = neededDependencies[name];
    _installPackage(name, version, where, options, done);
  }, done);
}

function _linkPackage (from, to, done) {
  (conf.link ? fs.symlink : cprf)(from, to, function () {
    console.log('%s > %s', from, to);
    var binDir = path.join(from, '.bin');
    fs.exists(binDir, function (exists) {
      if (!exists) return done();

      fs.readdir(binDir, function (err, files) {
        if (!files || !files.length) return done();

        var destBinDir = path.join(path.dirname(to), '.bin');
        if (!fs.existsSync(destBinDir)) mkdirp.sync(destBinDir);

        async.each(files, function (file, done) {
          var fullFileName = path.join(binDir, file);
          var destFileName = path.join(destBinDir, file);

          cprf(fullFileName, destFileName,  function (err) {
            if (err) throw err;
            console.log('%s > %s', fullFileName, destFileName);
            done();
          });
        }, done);
      });
    });
  });
}

function _installPackage (package, version, where, options, done) {
  var cachedPkgDir = path.join(conf.cachedir, package);
  var linkedPkgDir = path.join(where, package);

  var fail = _installPackageFromRegistry.bind(
    this, package, version, cachedPkgDir, function (installedVersion) {
      _linkPackage(
        path.join(cachedPkgDir, installedVersion), 
        linkedPkgDir, done);
    });

  fs.exists(cachedPkgDir, function (exists) {
    if (!exists) return fail();

    fs.readdir(cachedPkgDir, function (err, versionDirs) {
      if (err || !versionDirs.length) return fail();

      var cleanVersion = /:/.test(version) ?
        utils.encodeURI(version) : 
        semver.maxSatisfying(versionDirs.filter(
          RegExp.prototype.test.bind(/\./)), version);

      if (!cleanVersion) return fail();

      var cleanVersionPath = path.join(cachedPkgDir, cleanVersion);
      fs.exists(cleanVersionPath, function (exists) {
        if (!exists) return fail();
        return _linkPackage(cleanVersionPath, linkedPkgDir, done);
      });
    });
  });
}

function _installPackageFromRegistry (package, version, where, done) {

  // TODO: reduce these hacky conditionals
  var cleanVersion = /\:/.test(version) ? 
    utils.encodeURI(version) : version;

  var precisePackage = /\:/.test(version) ?
    version : [package, cleanVersion].join('@');

  // TODO: maybe too agressive of a path isolation. 
  // Refactor the whole thing;
  var installPrefix = path.join(conf.tmpdir, 
    [package, cleanVersion].join('_'));

  if (!fs.existsSync(where)) mkdirp.sync(where);
  if (!fs.existsSync(installPrefix)) mkdirp.sync(installPrefix);

  var npm = spawn('npm', [
    '--color=always',
    '--registry=' + conf.registry,
    '--prefix=' + installPrefix,
    'install', precisePackage
  ]);

  console.log('downloading and installing %s...', precisePackage)

  npm.stdout.on('data', function (data) {
    process.stdout.write(data);
  });

  npm.stderr.on('data', function (data) {
    process.stderr.write(data);
  });

  npm.on('close', function (code) {
    var pkgDir = path.join(installPrefix, 'node_modules', package);
    var binDir = path.join(installPrefix, 'node_modules', '.bin');

    fs.exists(binDir, function (exists) {
      if (!exists) return _movePackageToCache();
      fs.rename(binDir, path.join(pkgDir, '.bin'), _movePackageToCache);
    });

    function _movePackageToCache() {
      fs.readFile(path.join(pkgDir, 'package.json'), function (err, packageTxt) {
        if (err) throw err;

        packageJson = JSON.parse(packageTxt);
        
        var preciseVersion = /:/.test(version) 
          ? cleanVersion 
          : packageJson.version;

        fs.rename(pkgDir, path.join(where, preciseVersion), function () {
          console.log('%s: done!', precisePackage);
          done(preciseVersion)
        });
      });
    }

  });
}


