'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Assinatura) {
  Assinatura.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      Mundipagg.createSubscriptionFromAssinatura(ctx.data, function(err, data) {
        if (!err) {
          ctx.data.id = data.id;
        }
        next(err);
      });
    }
  });
};
