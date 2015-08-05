'use strict';

var jshintcli = require('jshint/src/cli');
var p = require('path');
var grunt = require('grunt');
var utils = require('./_utils');

// Expose jshint
module.exports = function (options, f) {
  options = options || {};

  utils.downloadDistantOrLoad(options.url, onConfigLoaded);

  function onConfigLoaded(err) {
    if (err) {
      return f(err);
    }

    options.config = jshintcli.loadConfig(p.resolve(process.cwd(), './.jshintrc'));
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
  }
};
