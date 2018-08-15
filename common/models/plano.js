'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Plano) {
  Plano.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      Mundipagg.createPlanFromPlano(ctx.data, function(err, data) {
        if (!err) {
          ctx.data.id = data.id;
        }
        next(err);
      });
    } else {
      delete ctx.data.id;
      Mundipagg.updatePlanFromPlano(ctx.currentInstance.id, ctx.data, next);
    }
  });
};
