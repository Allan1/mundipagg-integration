'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Cartao) {
  Cartao.validatesPresenceOf('cliente_id');

  Cartao.observe('before save', function(ctx, next) {
    console.log('data', ctx.instance);
    if (ctx.isNewInstance === true && ctx.instance.cliente_id) {
      Cartao.app.models.Cliente
        .findById(ctx.instance.cliente_id, function(err, cliente) {
          if (!err) {
            console.log('titular', cliente.nome);
            ctx.instance.titular = cliente.nome;
          }
          next(err);
        });
    } else {
      next();
    }
  });

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
