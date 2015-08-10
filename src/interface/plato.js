'use strict';

var plato = require('plato');
var p = require('path');
var grunt = require('grunt');

module.exports = function (debug) {
  // Expose plato
  return function (options, f) {
    var files = grunt.file.expand(options.args),
        maintainability = parseFloat(options.maintainability),
        belowThreshold = [],
        errorMessage = '',
        curMaintainability;

    if (files.length > 0) {
      debug('analyzing ' + files.length + ' files through plato...');

      var callback = function (report) {
        for (var i in report) {
          curMaintainability = parseFloat(
            report[i].complexity.maintainability
          );

          if (curMaintainability < maintainability) {
            belowThreshold.push(report[i]);
          }
        }

        if (belowThreshold.length) {
          debug(
            belowThreshold.length +
            ' files are below plato maintainability threshold'
          );

          errorMessage += ('Some files are below maintainability threshold ' +
                           '[' + maintainability.toFixed(2) + '%]:')

          for (var i in belowThreshold) {
            curMaintainability = parseFloat(
              belowThreshold[i].complexity.maintainability
            );

            errorMessage += ('\n * ' + belowThreshold[i].info.file + ' [' +
                               curMaintainability.toFixed(2) +
                             '%]');
          }

          f(errorMessage);
        } else {
          debug('done with plato analysis');

          console.log(
            'All files above maintainability threshold ' +
            '[' + maintainability.toFixed(2) + '%]'
          );

          f();
        }
      };

      plato.inspect(files, null, {}, callback);
    } else {
      debug('no file to be analyzed by plato');

      f();
    }
  };
};
