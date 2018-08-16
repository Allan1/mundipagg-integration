'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Assinatura) {
  Assinatura.validatesPresenceOf('cliente_id');
  Assinatura.validatesPresenceOf('cartao_id');
  Assinatura.validatesPresenceOf('plano_id');

  Assinatura.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      Assinatura.app.models.Cartao
        .findById(ctx.data.cartao_id, function(err, cartao) {
          if (err) {
            next(err);
          } else {
            let data = ctx.data;
            data.cartao = cartao;
            Mundipagg.createSubscriptionFromAssinatura(
              data,
              function(err, subscription) {
                if (!err) {
                  ctx.data.id = subscription.id;
                }
                next(err);
              }
          );
          }
        });
    } else {
      next();
    }
  });

  Assinatura.cancel = function(ctx, cb) {

  };

  Assinatura.remoteMethod(
    'prototype.cancel',
    {
      description: 'Cancela a assinatura indicada',
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'data', type: 'Cartao', description: 'Data'},
      ],
      returns: {
        arg: 'data', type: 'Cartao', root: true,
      },
      http: {path: '/cancela', verb: 'post'},
    }
  );
};
