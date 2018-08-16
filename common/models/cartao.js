'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Cartao) {
  Cartao.validatesPresenceOf('cliente_id');

  Cartao.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      Mundipagg.createCardFromCartao(ctx.data, function(err, data) {
        if (!err) {
          ctx.data.id = data.id;
        }
        next(err);
      });
    } else {
      Mundipagg.updateCardFromCartao(ctx.data, next);
    }
  });
};
