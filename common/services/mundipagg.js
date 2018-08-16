'use strict';

var request = require('request');

module.exports = {

  getRequestBaseOptions: function() {
    return {
      baseUrl: process.env.MUNDIPAGG_ENDPOINT,
      headers: {
        'Authorization': 'Basic ' +
        new Buffer
          .from(process.env.MUNDIPAGG_SECRET_KEY + ':')
          .toString('base64'),
        'Content-Type': 'application/json',
      },
      json: true,
    };
  },

  parseSchemeType: function(tipoPreco) {
    let schemeType = 'unit';
    switch (tipoPreco) {
      case 'pacote':
        schemeType = 'package';
        break;
      case 'volume':
      case 'tier':
        schemeType = tipoPreco;
        break;
    }
    return schemeType;
  },

  call: function(method, path, data, cb) {
    let self = this;
    let options = this.getRequestBaseOptions();
    options.method = method;
    options.url = path;
    options.body = data;

    request(options, function(err, response, body) {
      self.handleResponse(err, response, body, cb);
    });
  },

  handleResponse: function(err, response, body, cb) {
    if (response && !response.statusCode.toString().startsWith('2')) {
      err = this.composeError(response);
    }
    cb(err, body);
  },

  composeError: function(response) {
    let body = response.body;
    let err = new Error();
    err.statusCode = response.statusCode;
    err.details = {
      messages: {},
    };
    err.message = body.message;

    switch (response.statusCode) {
      case 422:
        err.name = 'ValidationError';
        break;
    }

    for (var key in body.errors) {
      let field = key.split('.').pop();
      err.details.messages[field] = body.errors[key];

      for (var i = 0; i < body.errors[key].length; i++) {
        err.message = err.message + ' ' + body.errors[key][i];
      }
    }

    return err;
  },

  post: function(path, data, cb) {
    this.call('POST', path, data, cb);
  },

  get: function(path, data, cb) {
    this.call('GET', path, data, cb);
  },

  put: function(path, data, cb) {
    this.call('PUT', path, data, cb);
  },

  delete: function(path, data, cb) {
    this.call('DELETE', path, data, cb);
  },

  createCustomerFromCliente: function(cliente, cb) {
    let customer = {
      name: cliente.nome,
      email: cliente.email,
    };
    this.post('/customers', customer, cb);
  },

  updateCustomerFromCliente: function(id, cliente, cb) {
    let customer = {
      name: cliente.nome,
      email: cliente.email,
    };
    this.put('/customers/' + id, customer, cb);
  },

  createPlanFromPlano: function(plano, cb) {
    let plan = {
      name: plano.nome,
      interval: plano.intervalo,
      interval_count: plano.contador_intervalo,
      trial_period_days: plano.dias_teste,
      items: [],
    };
    plano.itens.forEach(item => {
      plan.items.push({
        name: item.nome,
        quantity: item.quantidade,
        cycles: item.ciclos,
        pricing_scheme: {
          price: item.preco,
          scheme_type: this.parseSchemeType(item.tipo_preco),
        },
      });
    });
    this.post('/plans', plan, cb);
  },

  updatePlanFromPlano: function(plano, cb) {
    let plan = {
      name: plan.nome,
      interval: plan.intervalo,
      interval_count: plan.contador_intervalo,
      trial_period_days: plan.dias_teste,
    };
    this.put('/plans', plan, cb);
  },

  createSubscriptionFromAssinatura: function(assinatura, cb) {
    let subscription = {
      plan_id: assinatura.plano_id,
      customer_id: assinatura.cliente_id,
      payment_method: 'credit_card',
      card: this.parseCardFromCartao(assinatura.cartao),
    };
    console.log('subscription', subscription);
    this.post('/subscriptions', subscription, cb);
  },

  parseCardFromCartao: function(cartao) {
    return {
      number: cartao.numero,
      exp_month: cartao.expiracao_mes,
      exp_year: cartao.expiracao_ano,
      cvv: cartao.cvv,
      holder_name: cartao.titular,
    };
  },

  createCardFromCartao: function(cartao, cb) {
    this.post(
      '/customers/' + cartao.cliente_id + '/cards',
      this.parseCardFromCartao(cartao),
      cb
    );
  },

  updateCardFromCartao: function(cartao, cb) {
    this.put(
      '/customers/' + cartao.cliente_id + '/cards',
      this.parseCardFromCartao(cartao),
      cb
    );
  },

};
