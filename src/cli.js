'use strict';

var JSON5 = require('json5');
var path = require('path');
var shjs = require('shelljs');

module.exports = function (debug) {
  var utils = require('./interface/_utils')(debug);
  var checkBuild = require('./checkBuild')(debug, utils);

  var checkbuildContent, checkbuildOptions;

  var checkbuildFile = [
    path.resolve(process.cwd(), './.checkbuild'),
    path.resolve(__dirname, './defaults/.checkbuild')
  ].filter(shjs.test.bind(shjs, '-e'))[0];

  if (!checkbuildFile) {
    console.error('`.checkbuild` is not present inside project root nor inside default folder.');
    process.exit(1);
  }

  debug('using root %s', checkbuildFile);

  utils.loadCheckbuildConf(checkbuildFile, function(err, checkbuildOptions) {
    if (err) {
      console.error.apply(this, err);
      return process.exit(1);
    }

    debug('using conf %s', JSON.stringify(checkbuildOptions, null, 2));

    checkBuild(checkbuildOptions, function (errors) {
      if (errors > 0 && !checkbuildOptions.checkbuild.allowFailures) {
        console.error('%s module(s) failed, exiting.', errors);
        return process.exit(1);
      }

      console.log('Done !');
      process.exit(0);
    });
  });
};
