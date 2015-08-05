'use strict';

var request = require('requestretry');
var path = require('path');
var url = require('url');
var fs = require('fs');
var _ = require('lodash');

module.exports = {
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
};
