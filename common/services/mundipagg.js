'use strict';

var request = require('request');

module.exports = {
  options: {
    baseUrl: process.env.MUNDIPAGG_ENDPOINT,
    headers: {
      'Authorization': 'Basic ' + new Buffer.from(process.env.MUNDIPAGG_SECRET_KEY + ':').toString('base64'),
      'Content-Type': 'application/json',
    },
    json: true,
  },

  call: function(method, path, data, cb) {
    let options = this.options;
    options.method = method;
    options.url = path;
    options.body = data;

    request(options, function(err, response, body) {
      if (!response.statusCode.toString().startsWith('2')) {
        err = new Error(body.message);
        err.statusCode = response.statusCode;
      }
      cb(err, body);
    });
  },

  post: function(path, data, cb) {
    this.call('POST', path, data, cb);
  },

  get: function(path, data, cb) {
    this.call('GET', path, data, cb);
  },

  put: function(path, data, cb) {
    this.call('PUT', path, data, cb);
  },

  delete: function(path, data, cb) {
    this.call('DELETE', path, data, cb);
  },

  createCustomer: function(customer, cb) {
    this.post('/customers', customer, cb);
  },
};
