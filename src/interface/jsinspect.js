'use strict';

var grunt = require('grunt');
var Inspector = require('jsinspect/lib/inspector');
var reporters = require('jsinspect/lib/reporters');

module.exports = function (debug) {
  return function (options, f) {
    options.args = grunt.file.expand(options.args);
    var inspector = new Inspector(options.args, {
      threshold: options.threshold,
      diff: options.diff,
      identifiers: options.identifiers
    });

    // Retrieve the requested reporter
    var ReporterType = reporters[options.reporter] || reporters['default'];
    debug('using reporter %s', ReporterType.name);

    new ReporterType(inspector, {
      diff: options.diff
    });

    var match = 0;
    inspector.on('match', function () {
      match++;
    });

    try {
      inspector.run();
    } catch (err) {
      return f(err);
    }

    if (match > 0) {
      return f(new Error('Similarity in code found'));
    }

    f();
  };
};
