'use strict';

var _ = require('lodash');
var Checker = require('jscs');
var bluebird = require('bluebird');
var configFile = require('jscs/lib/cli-config');
var fs = require('fs');
var grunt = require('grunt');
var path = require('path');
var request = require('requestretry');

module.exports = function (debug) {
  return function (options, f) {
    options = _.assign({
      args: [],
      color: true,
      config: path.join(process.cwd(), '.jscsrc'),
      esnext: false
    }, options);

    var args = grunt.file.expand(options.args);
    var checker = new Checker(options);
    var config;
    var configPath = options.config;
    var hasColors = options.color && process.stdout && process.stdout.isTTY;
    var reporter;
    var reporterPath = 'jscs/lib/reporters/' + (hasColors ? 'console' : 'text');

    debug('loading config %s', configPath);
    config = configFile.load(configPath);

    if (!config) {
      config = configFile.load(path.join(__dirname, '../../defaults/.jscsrc'));
    }

    if (!config) {
      return f(new Error('Configuration source ' + configPath + ' was not found and default configuration failed to load'));
    }

    if (options.maxErrors) {
      config.maxErrors = Number(options.maxErrors);
    }

    if (options.reporter) {
      reporterPath = path.resolve(process.cwd(), options.reporter);

      if (!fs.existsSync(reporterPath)) {
        reporterPath = 'jscs/lib/reporters/' + options.reporter;
      }
    }

    try {
      reporter = require(reporterPath);
    } catch (e) {
      return f(new Error('Reporter ' + reporterPath + 'doesn\'t exist.'));
    }

    checker.registerDefaultRules();
    checker.configure(config);
    bluebird.all(args.map(checker.checkPath, checker)).then(function (results) {
      var errorsCollection = [].concat.apply([], results);

      reporter(errorsCollection);

      var hasErrors = errorsCollection.some(function (errors) {
        return !errors.isEmpty();
      });

      if (hasErrors) {
        return f(new Error('Found issues with code style'));
      }

      return f();
    }, f);
  };
};
