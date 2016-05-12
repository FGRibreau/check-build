'use strict';

var shjs = require('shelljs');
var p = require('path');

module.exports = function (debug) {

  return function (options, f) {
    var nsp = require.resolve('nsp-jcare/bin/nsp');
    var cmd = ['node', nsp, 'check'];
    cmd = cmd.concat(options.args || []).join(' ');

    debug('running %s', cmd);
    var ret = shjs.exec(cmd).code;
    if (ret !== 0) {
      debug('got exit code %s', ret);
      return f(new Error('Security issue'));
    }

    f();
  };
};
