'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Cliente) {
  // Cliente.nestRemoting('assinaturas');

  Cliente.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      Mundipagg.createCustomerFromCliente(ctx.data, function(err, data) {
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
    Cliente.findById(data.cliente_id, function(err, cliente) {
      if (err) {
        cb(err);
      } else {
        cliente.cartoes.create(data.cartao, function(err, cartao) {
          if (err) {
            cb(err);
          } else {
            cliente.assinaturas(function(err, assinaturas) {
              if (err) {
                cb(err);
              } else {
                assinaturas = assinaturas || [];
                Promise.all(assinaturas.map(async function(assinatura) {
                  return await new Promise(function(resolve, reject) {
                    Mundipagg.updateSubscriptionCard(
                      assinatura.id,
                      cartao.id,
                      function(err, subscription) {
                        if (err) {
                          reject(err);
                        } else {
                          assinatura.updateAttributes({
                            cartao_id: cartao.id,
                          }, function(err, updatedAssinatura) {
                            if (err) {
                              reject(err);
                            } else {
                              resolve(updatedAssinatura);
                            }
                          });
                        }
                      });
                  });
                }))
                .then((r)=>{
                  cartao.assinaturas = r;
                  cb(null, cartao);
                })
                .catch((err)=>{ cb(err); });
              }
            });
          }
        });
      }
    });
  };

  Cliente.remoteMethod(
    'replaceCard',
    {
      description: 'Substitui o cartão atual por um novo',
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {
          arg: 'data',
          type: 'object',
          description: 'Data',
          http: {source: 'body'},
        },
      ],
      returns: {
        arg: 'data', type: 'Cartao', root: true,
      },
      http: {path: '/alteraCartao', verb: 'post'},
    }
  );
};
