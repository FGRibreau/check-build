'use strict';

// quick and dirty integration of jsxhint
var shjs = require('shelljs');
var p = require('path');
var _ = require('lodash');
var grunt = require('grunt');
var exec = require('child_process').exec;

module.exports = function (debug) {

  return function (options, f) {
    options = options || {};
    var NODE_MODULES = p.resolve(__dirname, '../../', 'node_modules/');
    var jsxhint = p.resolve(NODE_MODULES, '.bin/jsxhint');

    var params = {
      '--config': [
        p.resolve(process.cwd(), './.jshintrc'),
        // fallback
        p.resolve(__dirname, '../../defaults/.jshintrc')
      ].filter(shjs.test.bind(shjs, '-e'))[0],
      '--reporter': require('jshint-stylish').toString()
    };

    var args = grunt.file.expand(options.args).join(' ');

    var cmd = [
      jsxhint,
      _.reduce(params, function (m, v, k) {
        m += ' ' + k + ' ' + v;
        return m;
      }, ''),
      args
    ].join(' ');

    debug('running %s', cmd);

    exec(cmd, function (error, stdout, stderr) {
      console.log(stdout);

      if (stderr) {
        console.error(stderr);
      }

      f(error !== null);
    });
  };
};
