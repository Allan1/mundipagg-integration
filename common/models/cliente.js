'use strict';

var Mundipagg = require('../services/mundipagg');

module.exports = function(Cliente) {
  Cliente.observe('persist', function(ctx, next) {
    if (ctx.isNewInstance === true) {
      Mundipagg.createCustomer({
        name: ctx.data.nome,
        email: ctx.data.email,
      }, function(err, data) {
        console.log(data);
        if (!err) {
          ctx.data.id = data.id;
        }
        next(err);
      });
    }
  	/* var da ta = ctx.instance ? ctx.instance : ctx.data;
  	if (ctx.instance) {
  		ctx.instance = data;
	  } else if(ctx.data){
	    ctx.data = data;
	  } */
  });
};
