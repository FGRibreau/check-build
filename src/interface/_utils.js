'use strict';

var request = require('requestretry');
var path = require('path');
var url = require('url');
var fs = require('fs');
var _ = require('lodash');
var async = require('async');
var shjs = require('shelljs');
var JSON5 = require('json5');
var spawn = require('child_process').spawn;

module.exports = function (debug) {

  /**
   * Download a distant file based on `url` and then call `f`, or directly call `f`
   * @param  {string|falsy} url
   * @param  {function} f(err)
   */
  function downloadDistantOrLoad(fileUrl, f) {
    if (!fileUrl || !_.isString(fileUrl)) {
      return f();
    }

    var filename = path.basename(url.parse(fileUrl).path);

    debug('downloading %s -> %s', fileUrl, filename);

    request({
      url: fileUrl
    }, function (err, resp, body) {
      if (err) {
        return f(err);
      }

      if (resp.statusCode < 200 || resp.statusCode >= 300) {
        return f(new Error('Invalid HTTP Status code "' + resp.statusCode + '" for "' + fileUrl + '"'));
      }

      fs.writeFileSync(path.resolve(process.cwd(), filename), body);

      f();
    });
  }

  /**
   * Load the proper checkbuild conf (using extends & urls)
   * @param  {string} filePath  Conf path
   * @param  {function} f       Callback:  f(err, conf)
   */
  function loadCheckbuildConf(filePath, f) {
    var conf;
    try {
      conf = shjs.cat(filePath);
    } catch (err) {
      return f(['Could not open `%s`', filePath, err]);
    }

    try {
      conf = JSON5.parse(conf);
    } catch (err) {
      return f(['Invalid json content inside `%s`', filePath, err]);
    }

    /**
     * Load and apply extends
     */
    function extendConf(conf, f) {
      if (_.isArray(conf.extends)) {
        async.reduce(conf.extends, conf, function(res, filePath, cb) {
          loadCheckbuildConf(filePath, function(err, conf) {
            /**
             * Do almost like _.defaultsDeep, but without merging arrays
             */
            function defaultsDeep(config, defaults) {
              if (_.isPlainObject(config)) {
                return _.mapValues(_.defaults(config, defaults), function(val, index) {
                  return defaultsDeep(_.get(config, index), _.get(defaults, index));
                });
              }

              return config || defaults;
            }

            cb(err, defaultsDeep(res, conf));
          });
        }, f);
      } else {
        f(null, conf);
      }
    }

    if (_.isArray(conf.urls)) {
      // Download distant files
      async.each(conf.urls, downloadDistantOrLoad, function(err) {
        if (err) {
          return f(['An error occured when loading distant files', err]);
        }

        extendConf(conf, f);
      });
    } else {
      extendConf(conf, f);
    }
  }

  function exec(cmd, args, f){
    spawn(cmd, args, {stdio:'inherit'}).on('exit', f);
  }

  return {
    downloadDistantOrLoad: downloadDistantOrLoad,
    loadCheckbuildConf: loadCheckbuildConf,
    exec: exec
  };
};
