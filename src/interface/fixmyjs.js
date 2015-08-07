'use strict';
module.exports = function (debug) {
  return function (options, f) {
    debug('doing nothing.');
    f();
  };
};
