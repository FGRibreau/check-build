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
  var commandOptionName;

  var possibleOptions = [
    'standard',
    'warningSeverity',
    'errorSeverity',
    'encoding',
    'standard'
  ];

  for (commandOptionName in possibleOptions) {
    if (_.has(opt, possibleOptions[commandOptionName])) {
      command += proccedCommandDetectection(opt, possibleOptions[commandOptionName]);
    }
  }

  if (_.has(opt, 'excludes') && _.isArray(opt.excludes)) {
    for (var i = 0, len = opt.excludes.length; i < len; i++) {
      command += ' --ignore=' + opt.excludes[i];
    }
  }

  if (_.has(opt, 'showSniffCode')) {
    command += ' -s';
  }

  if (_.has(opt, 'includes') && _.isArray(opt.includes)) {
      command += ' ' + opt.includes.join(' ');
  }

  return command;
};

var proccedCommandDetectection = function (opt, optionName) {
  return ' --' + _.kebabCase(optionName) + '="' + opt[optionName] + '"';
};

module.exports = phpcsInterface;
