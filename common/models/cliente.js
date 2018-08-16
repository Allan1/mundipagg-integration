'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Cliente) {
  //Cliente.nestRemoting('assinaturas');

  Cliente.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      Mundipagg.createCustomerFromCliente(ctx.data, function(err, data) {
        console.log(data);
        if (!err) {
          ctx.data.id = data.id;
        }
        next(err);
      });
    } else {
      Mundipagg
        .updateCustomerFromCliente(ctx.currentInstance.id, ctx.data, next);
    }
  });

  Cliente.replaceCard = function(ctx, data, cb) {
    ctx.instance.cartoes.add(data, function(err, cartao) {
      if (err) {
        cb(err);
      } else {
        // substitui em cada assinatura
        ctx.instance.assinaturas(function(err, assinaturas) {
          if (err) {
            cb(err);
          } else {
            assinaturas = assinaturas || [];
            Promise.all(assinaturas.map(async (assinatura) => {
              assinatura.cartao_id = cartao.id;
              return await assinatura.save();
            }))
            .then(()=>{cb(null, cartao)})
            .catch((err)=>{cb(err)});
          }
        });
      }
    });
  };

  Cliente.remoteMethod(
    'prototype.replaceCard',
    {
      description: 'Substitui o cartão atual por um novo',
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'data', type: 'Cartao', description: 'Data'},
      ],
      returns: {
        arg: 'data', type: 'Cartao', root: true,
      },
      http: {path: '/alteraCartao', verb: 'post'},
    }
  );
};
