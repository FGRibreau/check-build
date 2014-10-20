'use strict';

var cli = require('jscs/lib/cli');
var grunt = require('grunt');

module.exports = function (options, f) {
  options = options || {};
  options.args = grunt.file.expand(options.args);
  cli(options);
  f();
};
