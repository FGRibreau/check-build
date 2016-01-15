'use strict';

var shjs = require('shelljs');
var p = require('path');

module.exports = function (debug) {

  return function (options, f) {
    var cmd = ['node', p.resolve(__dirname, '../../node_modules/nsp-jcare/bin/nsp'), 'check'];
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
