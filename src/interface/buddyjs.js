'use strict';

var Detector = require('buddy.js/lib/detector');
var reporters = require('buddy.js/lib/reporters');
var grunt = require('grunt');

module.exports = function (options, f) {
  options.args = grunt.file.expand(options.args);

  // Retrieve the requested reporter, defaulting to simple
  var ReporterType = reporters[options.reporter] || reporters.simple;
  var detector = new Detector(options.args, options.enforceConst, options.ignore);
  new ReporterType(detector);

  var found = 0;

  detector.on('found', function () {
    found++;
  });

  detector.run(f).then(f).
  catch (f);
};
