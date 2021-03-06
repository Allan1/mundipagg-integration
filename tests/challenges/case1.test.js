/* global beforeAll, jest */
'use strict';

const request = require('supertest');
var assert = require('assert');
var faker = require('faker');
const app = require('../../server/server');
var f = require('../utils/format');

jest.setTimeout(30000);

describe('Case 1', () => {
  let planoId = null;

  beforeAll(() => {
    let planoNome = 'Sanarflix ' + Date.now();
    return request(app)
      .post('/api/planos')
      .send({
        'nome': planoNome,
        'intervalo': 'mensal',
        'contador_intervalo': 1,
        'dias_teste': 1,
        'itens': [
          {
            'nome': 'Sanarflix',
            'quantidade': 1,
            'preco': Math.floor(Math.random() * 1000),
            'tipo_preco': 'unidade',
          },
        ],
      })
      .expect(200)
      .then(response => {
        planoId = response.body.id;
        assert.equal(response.body.nome, planoNome);
      });
  });

  test('should subscribe new customer to the plan', () => {
    return request(app)
      .post('/api/pedidos')
      .send({
        'cliente': {
          'nome': 'Mario ' + f.removeNonAlpha(faker.name.lastName()),
          'email': faker.internet.email(),
        },
        'cartao': {
          'numero': '4012888888881881',
          'expiracao_mes': 12,
          'expiracao_ano': 2019,
          'cvv': '597',
        },
        'produtos': [
          {
            'tipo': 'plano',
            'plano_id': planoId,
          },
        ],
      })
      .expect(200)
      .then(response => {
        assert.equal(response.body.produtos[0].plano_id, planoId);
      });
  });
});
