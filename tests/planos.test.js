'use strict';

const request = require('supertest');
var assert = require('assert');

const app = require('../server/server');

describe('POST /api/planos', () => {
  afterEach(() => {

  });

  test('should respond with a 200 for valid params', () => {
    return request(app)
      .post('/api/planos')
      .send({
        'nome': 'PlanA',
        'intervalo': 'month',
        'contador_intervalo': 1,
        'dias_teste': 1,
        'itens': [
          {
            'nome': 'ItemA',
            'quantidade': 1,
            'preco': 25,
            'tipo_preco': 'unidade',
          },
        ],
      })
      .expect(200)
      .then(response => {
        assert(response.body.nome, 'PlanA');
      });
  });
});
