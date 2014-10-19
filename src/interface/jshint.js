var jshint = require('jshint').JSHINT;
var jshintcli = require('jshint/src/cli');
var p = require('path');
var grunt = require('grunt');
var fixmyjs = require('fixmyjs');
var shjs = require("shelljs");

// Expose jshint
module.exports = function (options, f, checkBuildOptions) {
  options = options || {};

  var config = [
    p.resolve(process.env.PWD, './.jshintrc'),
    // fallback
    p.resolve(__dirname, '../../defaults/.jshintrc')
  ].filter(function (path) {
    return shjs.test('-e', path);
  })[0];

  try {
    options.config = jshintcli.loadConfig(config);
  } catch (err) {
    return f(new Error('Loading `.jshintrc` : %s\n%s', config, err));
  }

  var filepath = process.env.PWD;
  options.args = grunt.file.expand(options.args);

  options.reporter = function (results, data, options) {
    // @todo implement fixmyfs
    // if (checkBuildOptions.checkbuild.enable.indexOf('fixmyjs') !== -1) {
    //   results.forEach(function (file) {
    //     console.log(fixmyjs.fix(shjs.cat(file.file), {}));
    //   });
    // }

    // use jshint-stylish by default
    var stylish = require(require('jshint-stylish')).reporter(results, data, options);
    return stylish;
  };

  var hadErrors = !jshintcli.run(options);
  f(hadErrors);
};
