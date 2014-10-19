var shjs = require("shelljs");
var p = require('path');

module.exports = function (options, f) {
  var pwd = process.env.PWD;
  var shrinkwrap = 'npm shrinkwrap';

  if (shjs.exec('cd "' + pwd + '";' + shrinkwrap).code !== 0) {
    return f(new Error(shrinkwrap + ' failed'));
  }
  var cmd = '/usr/bin/env node ' + p.resolve(__dirname, '../../node_modules/nsp/bin/nspCLI.js shrinkwrap');

  var ret = shjs.exec(cmd).code;
  if (ret !== 0) {
    return f(new Error('Security issue'));
  }

  f();
};
