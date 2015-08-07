'use strict';

var JSON5 = require('json5');
var path = require('path');
var shjs = require('shelljs');

module.exports = function (debug) {
  var checkBuild = require('./checkBuild')(debug);

  var checkbuildContent, checkbuildOptions;

  var checkbuildFile = [
    path.resolve(process.cwd(), './.checkbuild'),
    path.resolve(__dirname, './defaults/.checkbuild')
  ].filter(shjs.test.bind(shjs, '-e'))[0];

  if (!checkbuildFile) {
    console.error('`.checkbuild` is not present inside project root nor inside default folder.');
    process.exit(1);
  }


  debug('using %s', checkbuildFile);

  try {
    checkbuildContent = shjs.cat(checkbuildFile);
  } catch (err) {
    console.error('Could not open `%s`', checkbuildFile, err);
  }

  if (!checkbuildContent) {
    console.log('Using default `.checkbuild`');
    checkbuildContent = shjs.cat(path.resolve(__dirname, './examples/.checkbuild'));
  }

  try {
    checkbuildOptions = JSON5.parse(checkbuildContent);
  } catch (err) {
    console.error('Invalid json content inside `.checkbuild`');
    console.error(err);
    process.exit(1);
  }


  checkBuild(checkbuildOptions, function (errors) {
    if (errors > 0 && !checkbuildOptions.checkbuild.allowFailures) {
      console.error();
      console.error('%s module(s) failed, exiting.', errors);
      return process.exit(1);
    }

    console.log('Done !');
    process.exit(0);
  });
};
