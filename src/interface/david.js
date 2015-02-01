'use strict';

var _ = require('lodash');
var david = require('david');
var shjs = require('shelljs');
var p = require('path');

module.exports = function (options, f) {
  options = _.assign({
    dev: false,
    stable: true
  }, options);

  var manifest;

  try {
    manifest = JSON.parse(shjs.cat(p.resolve(process.cwd(), './package.json')));
  } catch (err) {
    return f(new Error('Loading `package.json` : ' + err));
  }

  david.getUpdatedDependencies(manifest, options, function (err, deps) {
    if (err) {
      console.log(err);
      return f(new Error('Could not get updated depencendies'));
    }

    deps = Object.keys(deps).reduce(function (obj, depName) {
      var dep = deps[depName];
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
