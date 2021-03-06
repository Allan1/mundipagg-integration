'use strict';

var Mundipagg = require('../services/mundipagg');
var app = require('../../server/server');

module.exports = function(Pedido) {
  Pedido.validatesPresenceOf('cliente_id');
  Pedido.validatesPresenceOf('cartao_id');

  Pedido.beforeRemote('create', function(ctx, instance, next) {
    if (ctx.args && ctx.args.data && ctx.args.data.cliente) {
      ctx.args.data.cartao.titular = ctx.args.data.cliente.nome;
      Pedido.app.models.Cliente
        .findOrCreate(ctx.args.data.cliente, function(err, cliente) {
          if (err) {
            next(err);
          } else {
            ctx.args.data.cliente_id = cliente.id;

            if (ctx.args.data.cartao) {
              cliente.cartoes
                .create(ctx.args.data.cartao, function(err, cartao) {
                  if (!err) {
                    ctx.args.data.cartao_id = cartao.id;
                  }
                  next(err);
                });
            } else {
              next();
            }
          }
        });
    } else {
      next();
    }
  });

  Pedido.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      let produtos = ctx.data.produtos || [];

      Promise.all(
        produtos.map(async function(produto) {
          if (produto.tipo === 'plano') {
            let produtoUpdated = await new Promise(function(resolve, reject) {
              app.models.Assinatura.create({
                cliente_id: ctx.data.cliente_id,
                plano_id: produto.plano_id,
                cartao_id: ctx.data.cartao_id,
              }, function(err, assinatura) {
                if (err) {
                  reject(err);
                } else {
                  produto.assinatura_id = assinatura.id;
                  resolve(produto);
                }
              });
            });
            return produtoUpdated;
          } else {
            return Promise.resolve();
          }
        })
      )
      .then((newProdutos)=>{
        ctx.data.produtos = newProdutos;
        next();
      })
      .catch((err)=>{ next(err); });
    }
  });

  Pedido.observe('after save', function(ctx, next) {
    if (ctx.isNewInstance) {
      Pedido.findById(ctx.instance.id, function(err, instance) {
        if (!err) {
          ctx.instance = instance;
        }
        next();
      });
    } else {
      next();
    }
  });

  Pedido.afterRemote('create', function(ctx, instance, cb) {
    if (instance) {
      instance.reload(function(err, reloaded) {
        if (!err) {
          ctx.result = reloaded;
        }
        cb(err);
      });
    } else {
      cb();
    }
  });
};
