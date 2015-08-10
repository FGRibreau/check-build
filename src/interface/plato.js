'use strict';

var plato = require('plato');
var grunt = require('grunt');

module.exports = function (debug) {
  // Expose plato
  return function (options, f) {
    var files = grunt.file.expand(options.args);
    var maintainability = parseFloat(options.maintainability);
    debug('maintainability=%s', maintainability);

    if (isNaN(maintainability)) {
      return f(new Error('when activated, plato requires a `maintainability` float option, `75.00` will be a good start.'));
    }


    if (files.length === 0) {
      debug('no files to be analyzed by plato');
      return f();
    }

    debug('analyzing ' + files.length + ' files through plato...');

    var callback = function (reports) {
      var filesBelowThreshold = reports.filter(function (report) {
        return report.complexity.maintainability < maintainability;
      });

      if (filesBelowThreshold.length === 0) {
        debug('done with plato analysis');

        console.log(
          'All files above maintainability threshold ' +
          '[' + maintainability.toFixed(2) + '%]'
        );

        return f();
      }

      debug(
        filesBelowThreshold.length +
        ' files are below plato maintainability threshold'
      );


      var errorMessage = filesBelowThreshold.reduce(function (errorMessage, report) {
        return errorMessage += ('\n * ' + report.info.file + ' [' + report.complexity.maintainability.toFixed(2) + '%]');
      }, 'Some files are below maintainability threshold ' + '[' + maintainability.toFixed(2) + '%]:');

      f(errorMessage);
    };

    plato.inspect(files, null, {}, callback);
  };
};
