'use strict';

const request = require('supertest');
var assert = require('assert');

const app = require('../server/server');

describe('Caso 1', () => {
  beforeAll(() => {
    return request(app)
      .post('/api/pedidos')
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

  test('should respond with a 200 for valid params', () => {
  });
});
