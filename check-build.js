#!/usr/bin/env node

'use strict';

var JSON5 = require('json5');
var p = require('path');
var shjs = require("shelljs");
var async = require("async");
var checkbuildContent, checkbuildOptions;

var checkbuildFile = [
  p.resolve(process.cwd(), './.checkbuild'),
  p.resolve(process.cwd(), './.checkbuildrc'),
  p.resolve(__dirname, './defaults/.checkbuildrc')
].filter(shjs.test.bind(shjs, '-e'))[0];

if (!checkbuildFile) {
  console.error('`.checkbuildrc` is not present inside project root nor inside default folder.');
  process.exit(1);
}

try {
  checkbuildContent = shjs.cat(checkbuildFile);
} catch (err) {
  console.error('Could not open `%s`', checkbuildFile, err);
}

try {
  checkbuildOptions = JSON5.parse(checkbuildContent);
} catch (err) {
  console.error('Invalid json content inside `.checkbuildrc`');
  console.error(err);
  process.exit(1);
}

async.reduce(
  checkbuildOptions.checkbuild.enable,
  0,
  function (errors, name, f) {
    var module;

    // require module interface
    try {
      module = require('./src/interface/' + name);
    } catch (err) {
      console.error('Checkbuild module interface for "%s" was not found', name);
      console.error(err);
    }

    // execute module interface
    console.log('[%s]', name);
    module(checkbuildOptions[name], function (err) {
      if (err) {
        console.error();
        console.error('Checkbuild module "%s" failed.', name);
        console.error();
        console.error(err);

        if (!checkbuildOptions.checkbuild.continueOnError) {
          return process.exit(1);
        }

        errors++;
      }

      console.log();

      f(null, errors);
    }, checkbuildOptions);

  },
  function done(__, errors) {

    if (errors > 0 && !checkbuildOptions.checkbuild.allowFailures) {
      console.error();
      console.error('%s module(s) failed, exiting.', errors);
      return process.exit(1);
    }

    console.log('Done !');
    process.exit(0);
  });
