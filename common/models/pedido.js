'use strict';

var Mundipagg = require('../services/mundipagg');
var app = require('../../server/server');

module.exports = function(Pedido) {
  Pedido.beforeRemote('create', function(ctx, instance, next) {
    if (ctx.args && ctx.args.data && ctx.args.data.cliente) {
      ctx.args.data.cliente.cartao = ctx.args.data.cartao;
      ctx.args.data.cliente.cartao.titular = ctx.args.data.cliente.nome;
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

      Promise.all(produtos.map(async (produto) => {
        if (produto.tipo === 'plano') {
          return await app.models.Assinatura.create({
            cliente_id: ctx.data.cliente_id,
            plano_id: produto.plano_id,
            cartao: ctx.data.cartao,
          });
        } else {
          return Promise.resolve(); 
        }
      }))
      .then(()=>{next()})
      .catch((err)=>{next(err)});
    }
  });
};
