/* global beforeAll */
'use strict';

const request = require('supertest');
var assert = require('assert');
var faker = require('faker');
const app = require('../../server/server');

describe('Case 2', () => {
  let planoId = null;
  let clienteId = null;
  let cartaoId = null;

  beforeAll(() => {
    let planoNome = 'Sanarflix 7 dias grátis' + Date.now();
    return request(app)
      .post('/api/planos')
      .send({
        'nome': planoNome,
        'intervalo': 'month',
        'contador_intervalo': 1,
        'dias_teste': 7,
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
        return request(app)
          .post('/api/clientes')
          .send({
            'nome': 'Juliana ' + faker.name.lastName(),
            'email': 'juliana@gmail.com',
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
  });

  test('should subscribe customer to plan with 7 days free trial', () => {
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
