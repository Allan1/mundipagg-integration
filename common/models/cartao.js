'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Cartao) {
  Cartao.validatesPresenceOf('cliente_id');

  Cartao.parseTitular = function(nome) {
    let titular = '';
    if (nome) {
      titular = nome.toUpperCase();
      titular = titular.replace(new RegExp('[ÁÀÂÃ]', 'gi'), 'A');
      titular = titular.replace(new RegExp('[ÉÈÊ]', 'gi'), 'E');
      titular = titular.replace(new RegExp('[ÍÌÎÏ]', 'gi'), 'I');
      titular = titular.replace(new RegExp('[ÓÒÔÕÖ]', 'gi'), 'O');
      titular = titular.replace(new RegExp('[ÚÙÛ]', 'gi'), 'U');
      titular = titular.replace(new RegExp('[Ç]', 'gi'), 'C');
      titular = titular.replace(new RegExp('[Ñ]', 'gi'), 'N');
    }
    return titular;
  };

  Cartao.observe('before save', function(ctx, next) {
    if (ctx.isNewInstance === true && ctx.instance.cliente_id) {
      Cartao.app.models.Cliente
        .findById(ctx.instance.cliente_id, function(err, cliente) {
          if (!err) {
            ctx.instance.titular = Cartao.parseTitular(cliente.nome);
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
