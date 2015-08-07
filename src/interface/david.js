'use strict';

var _ = require('lodash');
var david = require('david');
var shjs = require('shelljs');
var p = require('path');

module.exports = function (debug) {
  return function (options, f) {
    options = _.assign({
      dev: false,
      stable: true,
      ignore: []
    }, options);

    var manifest;
    var packagePath = p.resolve(process.cwd(), './package.json');
    debug('reading %s', packagePath);

    try {
      manifest = JSON.parse(shjs.cat(packagePath));
    } catch (err) {
      return f(new Error('Loading `package.json` : ' + err));
    }

    debug('running david with options=%s', JSON.stringify(options));

    david.getUpdatedDependencies(manifest, options, function (err, deps) {
      if (err) {
        console.log(err);
        return f(new Error('Could not get updated depencendies'));
      }

      deps = Object.keys(deps).reduce(function (obj, depName) {
        var dep = deps[depName];

        if (options.ignore.indexOf(depName) !== -1) {
          // once https://github.com/alanshaw/david/issues/63
          // will be fixed, we will be able to remove these lines
          console.log('Ignoring: %s', depName);
          return obj;
        }

        if (!dep.warn) {
          obj[depName] = dep;
          return obj; // keep non-warn deps
        }

        console.log('Skipping %s', dep.warn.message);
        return obj; // skip wark
      }, {});

      if (Object.keys(deps).length > 0) {
        listDependencies(deps);
        return f(new Error('At least one dependency needs to be updated'));
      }

      f();
    });

    function listDependencies(deps) {
      Object.keys(deps).forEach(function (depName) {
        var required = deps[depName].required || '*';
        var stable = deps[depName].stable || 'None';
        var latest = deps[depName].latest;
        console.log('%s Required: %s Stable: %s Latest: %s', depName, required, stable, latest);
      });
    }
  };
};
