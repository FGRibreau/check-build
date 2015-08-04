'use strict';

var jshintcli = require('jshint/src/cli');
var stripJsonComments = require('strip-json-comments');
var p = require('path');
var grunt = require('grunt');
var shjs = require('shelljs');
var fs = require('fs');
var path = require('path');
var request = require('requestretry');

// Expose jshint
module.exports = function (options, f) {
  options = options || {};

  if (options.url) {
    request({
      url: options.url
    }, function (err, resp, body) {
      if (err) {
        return f(err);
      }

      fs.writeFileSync(path.resolve(process.cwd(), '.jshintrc'), body);

      onConfigLoaded();
    });
  } else {
    onConfigLoaded();
  }

  function onConfigLoaded() {
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
