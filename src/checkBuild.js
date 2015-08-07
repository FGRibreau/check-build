'use strict';

var async = require('async');

module.exports = function (debug) {

  /**
   * [checkBuild description]
   * @param  {Object} checkbuildOptions check build options
   * @param  {function} f(err)
   */
  return function checkBuild(checkbuildOptions, f) {

    async.reduce(checkbuildOptions.checkbuild.enable, 0, checkModuleInterface, done);

    function checkModuleInterface(errors, name, f) {
      var module;

      // require module interface
      try {
        debug('loading interface %s', name);
        module = require('./interface/' + name);
      } catch (err) {
        console.error('Checkbuild module interface for "%s" was not found', name);
        console.error(err);
      }

      // execute module interface
      console.log('[%s]', name);
      module(debug)(checkbuildOptions[name], function (err) {
        if (err) {
          console.error();
          console.error('Checkbuild module "%s" failed.', name);
          console.error();
          console.error(err);

          if (!checkbuildOptions.checkbuild.continueOnError) {
            return process.exit(1);
          }

          errors++;
        }

        console.log();

        f(null, errors);
      }, checkbuildOptions);
    }

    function done(__, errors) {
      f(errors);
    }
  };
};
