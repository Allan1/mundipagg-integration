'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Cliente) {
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
  	/* var da ta = ctx.instance ? ctx.instance : ctx.data;
  	if (ctx.instance) {
  		ctx.instance = data;
	  } else if(ctx.data){
	    ctx.data = data;
	  } */
  });
};
