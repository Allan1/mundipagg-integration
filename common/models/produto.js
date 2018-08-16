'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Produto) {
  Produto.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      Mundipagg.createCustomer({
        name: ctx.data.nome,
        email: ctx.data.email,
      }, function(err, data) {
        console.log(data);
        if (!err) {
          ctx.data.id = data.id;
        }
        next(err);
      });
    }
  });
};
