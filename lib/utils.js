var fs = require('fs');

module.exports.getHomeDir = function () {
  return process.env[(process.platform == 'win32') ? 
    'USERPROFILE' : 
    'HOME'
  ];
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
    dependencies: packageJsonObject.dependencies,
    devDependencies: packageJsonObject.devDependencies
  };
};

