'use strict';

var grunt = require('grunt');
var Inspector = require('jsinspect/lib/inspector');
var reporters = require('jsinspect/lib/reporters');

module.exports = function (options, f) {
  options.args = grunt.file.expand(options.args);
  var inspector = new Inspector(options.args, {
    threshold: options.threshold,
    diff: options.diff,
    identifiers: options.identifiers
  });

  // Retrieve the requested reporter
  var ReporterType = reporters[options.reporter] || reporters['default'];
  new ReporterType(inspector, options.diff);

  try {
    inspector.run();
  } catch (err) {
    return f(err);
  }

  f();
};
