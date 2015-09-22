'use strict';

var p = require('path');
var grunt = require('grunt');
var exec = require('child_process').exec;

module.exports = function (debug) {
  var utils = require('./_utils')(debug);

  return function (options, f) {
    options = options || {};

    utils.downloadDistantOrLoad(options.url, onConfigLoaded);

    function onConfigLoaded(err) {
      if (err) {
        return f(err);
      }

      var config = p.resolve(process.cwd(), './.eslintrc');
      var files = grunt.file.expand(options.args);
      var args = ['--config', config].concat(files);
      var NODE_MODULES = p.resolve(__dirname, '../../', 'node_modules/');
      var eslint = p.resolve(NODE_MODULES, '.bin/eslint');

      var cmd = [eslint].concat(args).join(' ');

      debug('running eslint with %s', cmd);

      ['node', 'check-build'].concat();

      exec(cmd, function (error, stdout, stderr) {
        console.log(stdout);

        if (stderr) {
          console.error(stderr);
        }

        var hadError = error && error.code !== 0;

        if(!hadError){
          console.log('✔ No problems');
        }

        f(hadError || null);
      });
    }
  };
};
