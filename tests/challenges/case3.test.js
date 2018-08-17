/* global beforeAll, jest */
'use strict';

const request = require('supertest');
var assert = require('assert');
var faker = require('faker');
const app = require('../../server/server');

jest.setTimeout(30000);

describe('Case 3', () => {
  let clienteId = null;
  let cartaoId = null;

  beforeAll(() => {
    return request(app)
      .post('/api/clientes')
      .send({
        'nome': 'Pedro ' + faker.name.lastName(),
        'email': faker.internet.email(),
      })
      .expect(200)
      .then(response => {
        assert.ok(response.body.id);
        clienteId = response.body.id;

        return request(app)
          .post('/api/clientes/' + clienteId + '/cartoes')
          .send({
            'numero': '4012888888881881',
            'expiracao_mes': 12,
            'expiracao_ano': 2019,
            'cvv': '597',
          })
          .expect(200)
          .then(response => {
            assert.ok(response.body.id);
            cartaoId = response.body.id;
          });
      });
  });

  test('should subscribe customer to quartely plan for R$69,90', () => {
    let planoNome = 'Sanarflix Trimestral ' + Date.now();
    return request(app)
      .post('/api/planos')
      .send({
        'nome': planoNome,
        'intervalo': 'month',
        'contador_intervalo': 3,
        'dias_teste': 1,
        'itens': [
          {
            'nome': 'Sanarflix',
            'quantidade': 1,
            'preco': 6990,
            'tipo_preco': 'unidade',
          },
        ],
      })
      .expect(200)
      .then(response => {
        assert.ok(response.body.id);
        let planoId = response.body.id;

        return request(app)
          .post('/api/pedidos')
          .send({
            'cliente_id': clienteId,
            'cartao_id': cartaoId,
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
});
