'use strict';

var shjs = require('shelljs');
var exec = require('child_process').exec;
var p = require('path');

module.exports = function (debug) {

  var utils = require('./_utils')(debug);

  return function (options, f) {
    var snyk = require.resolve('snyk/cli/index');
    if (!options) {
      options = {
        args : []
      };
    }

    var args = ['test'].concat(options.args);

    debug('running snyk with %s', [snyk].concat(args).join(' '));

    utils.exec(snyk, args, function (error) {

      var hadError = error && error.code !== 0;

      if(!hadError){
        console.log('✔ No problems');
      }

      f(hadError || null);
    });
  };
};
