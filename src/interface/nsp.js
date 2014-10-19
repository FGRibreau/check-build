'use strict';

var shjs = require("shelljs");
var p = require('path');

module.exports = function (options, f) {
  // @todo do not rely on "/usr/bin/env"
  var cmd = '/usr/bin/env node ' + p.resolve(__dirname, '../../node_modules/nsp/bin/nspCLI.js package');
  var ret = shjs.exec(cmd).code;

  if (ret !== 0) {
    return f(new Error('Security issue'));
  }

  f();
};
