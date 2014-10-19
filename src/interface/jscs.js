var Cli = require('jscs/lib/cli');
var shjs = require("shelljs");
var grunt = require('grunt');

module.exports = function (options, f) {
  options = options || {};
  options.args = grunt.file.expand(options.args);
  Cli(options);
  f();
};
