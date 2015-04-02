'use strict';

var exec = require('child_process').exec;
var _ = require('lodash');

var phpcsInterface = function (options, f) {
  var phpcs = exec(buildCommand(options), function (error, stdout) {
    if (error) {
      console.log(stdout);
      f(new Error('Phpcs failed see errors above.'));
    } else {
      console.log('Everythings fine.');
    }
    f();
  });

  phpcs.stdin.end();
};


var buildCommand = function (opt) {
  opt = opt || {};

  var command = opt.bin || 'phpcs';

  var possibleOptions = [
    'standard',
    'warningSeverity',
    'errorSeverity',
    'encoding'
  ];

  var formatParamter = _.curry(proccedCommandDetection);
  var formatExclude = _.curry(function (exclusion) {
      return '--ignore=' + exclusion;
  });

  var has = _.curry(_.has, 2);
  var isArray = _.curry(_.isArray, 1);

  var parameters = _.chain(possibleOptions)
    .filter(has(opt))
    .map(formatParamter(opt))
    .value();

  var ignores = _.chain(opt)
    .pick('excludes')
    .filter(isArray())
    .first()
    .map(formatExclude())
    .value();

  var sniffCode = _.has(opt, 'showSniffCode') ? '-s':'';

  var includes = _.chain(opt)
    .pick('includes')
    .filter(isArray())
    .first()
    .value();

  return [command].concat(parameters, ignores, sniffCode, includes).join(' ');
};

var proccedCommandDetection = function (opt, optionName) {
  return '--' + _.kebabCase(optionName) + '="' + opt[optionName] + '"';
};

module.exports = phpcsInterface;
