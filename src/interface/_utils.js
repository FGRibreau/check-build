'use strict';

var request = require('requestretry');
var path = require('path');
var url = require('url');
var fs = require('fs');
var _ = require('lodash');
var shjs = require('shelljs');
var JSON5 = require('json5');

module.exports = function (debug) {

  return {
    /**
     * Download a distant file based on `url` and then call `f`, or directly call `f`
     * @param  {string|falsy} url
     * @param  {function} f(err)
     */
    downloadDistantOrLoad: function (fileUrl, f) {
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
    },

    loadCheckbuildConf: function loadCheckbuildConf(filePath) {
      var conf;
      try {
        conf = shjs.cat(filePath);
      } catch (err) {
        console.error('Could not open `%s`', filePath, err);
        return process.exit(1);
      }

      try {
        conf = JSON5.parse(conf);
      } catch (err) {
        console.error('Invalid json content inside `%s`', filePath, err);
        return process.exit(1);
      }

      if (_.isArray(conf.extends)) {
        conf = _.reduce(conf.extends, function(res, filePath) {
          return _.defaultsDeep(res, loadCheckbuildConf(filePath));
        }, conf);
      }

      return conf;
    }
  };
};
