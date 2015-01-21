'use strict';

var _ = require('lodash');
var david = require('david');
var shjs = require('shelljs');
var p = require('path');

module.exports = function (options, f) {
  options = _.extend({
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
      return f(new Error('Could not get updated depencendies'));
    }

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
