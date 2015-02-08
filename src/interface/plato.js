'use strict';

var shjs = require("shelljs");
var p = require('path');

module.exports = function (options, f) {
  // @todo do not rely on "/usr/bin/env"
  var cmd = 'plato -r -d report ' + p.resolve(__dirname);
  var ret = shjs.exec(cmd).code;


  if (ret !== 0) {
    return f(new Error('Security issue'));
  }

  var platoRes = shjs.cat(p.resolve(__dirname, '../../node_modules/plato/bin/plato.js package'));
  var avgMaintainability = parseFloat(JSON.parse(platoRes).average.maintainability);

  if (avgMaintainability < 70) {
    return f(new Error('Your project average maintainability is under 70%'));
  }

  f();
};