'use strict';

var jshintcli = require('jshint/src/cli');
var p = require('path');
var grunt = require('grunt');
var shjs = require("shelljs");

// Expose jshint
module.exports = function (options, f) {
  options = options || {};

  var config = [
    p.resolve(process.cwd(), './.jshintrc'),
    // fallback
    p.resolve(__dirname, '../../defaults/.jshintrc')
  ].filter(shjs.test.bind(shjs, '-e'))[0];

  try {
    options.config = jshintcli.loadConfig(config);
  } catch (err) {
    return f(new Error('Loading `.jshintrc` : %s\n%s', config, err));
  }

  options.args = grunt.file.expand(options.args);

  options.reporter = function (results, data, options) {
    // @todo implement fixmyfs
    // if (checkBuildOptions.checkbuild.enable.indexOf('fixmyjs') !== -1) {
    //   results.forEach(function (file) {
    //     console.log(fixmyjs.fix(shjs.cat(file.file), {}));
    //   });
    // }

    // use jshint-stylish by default
    var stylish = require('jshint-stylish').reporter(results, data, options);
    return stylish;
  };

  var hadErrors = !jshintcli.run(options);
  f(hadErrors);
};
