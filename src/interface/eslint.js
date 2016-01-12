'use strict';

var p = require('path');
var grunt = require('grunt');
var exec = require('child_process').exec;

module.exports = function (debug) {
  var utils = require('./_utils')(debug);

  return function (options, f) {
    options = options || {};

    var config = p.resolve(process.cwd(), './.eslintrc');
    var files = grunt.file.expand(options.args);
    var args = ['--config', config].concat(files);
    var NODE_MODULES = p.resolve(__dirname, '../../', 'node_modules/');
    var eslint = p.resolve(NODE_MODULES, '.bin/eslint');

    debug('running eslint with %s', [eslint].concat(args).join(' '));

    ['node', 'check-build'].concat();

    utils.exec(eslint, args, function (error) {

      var hadError = error && error.code !== 0;

      if(!hadError){
        console.log('✔ No problems');
      }

      f(hadError || null);
    });
  };
};
