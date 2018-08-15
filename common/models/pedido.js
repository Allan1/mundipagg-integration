'use strict';

var Mundipagg = require('../services/mundipagg');
var app = require('../../server/server');

module.exports = function(Pedido) {
  Pedido.beforeRemote('create', function(ctx, instance, next) {
    if (ctx.args && ctx.args.data && ctx.args.data.cliente) {
      ctx.args.data.cliente.cartao = ctx.args.data.cartao;
      Pedido.app.models.Cliente
        .findOrCreate(ctx.args.data.cliente, function(err, cliente) {
          if (!err) {
            ctx.args.data.cliente_id = cliente.id;
          }
          next(err);
        });
    } else {
      next();
    }
  });

  Pedido.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      let produtos = ctx.data.produtos || [];
      produtos.forEach(function(produto) {
        if (produto.tipo === 'plano') {
          app.models.Assinatura.create({
            cliente_id: ctx.data.cliente_id,
            plano_id: ctx.data.plano_id,
            cartao: ctx.data.cartao,
          });
        }
      });

      next();
    }
  });
};
