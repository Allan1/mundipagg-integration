/* global beforeAll, jest */
'use strict';

const request = require('supertest');
var assert = require('assert');
var faker = require('faker');
const app = require('../../server/server');

jest.setTimeout(30000);

describe('Case 4', () => {
  let clienteId = null;
  let cartaoId = null;
  let planoId = null;

  beforeAll(() => {
    return request(app)
      .post('/api/clientes')
      .send({
        'nome': 'Marcos',
        'email': 'marcos@gmail.com',
      })
      .expect(200)
      .then(response => {
        assert.ok(response.body.id);
        clienteId = response.body.id;

        return request(app)
          .post('/api/clientes/' + clienteId + '/cartoes')
          .send({
            'numero': '4012888888881881',
            'expiracao_mes': 10,
            'expiracao_ano': 2023,
            'cvv': '987',
          })
          .expect(200)
          .then(response => {
            assert.ok(response.body.id);
            cartaoId = response.body.id;

            return request(app)
              .post('/api/planos')
              .send({
                'nome': 'Sarnarflix ' + Date.now(),
                'intervalo': 'month',
                'contador_intervalo': 1,
                'dias_teste': 1,
                'itens': [
                  {
                    'nome': 'Sanarflix',
                    'quantidade': 1,
                    'preco': 2450,
                    'tipo_preco': 'unidade',
                  },
                ],
              })
              .expect(200)
              .then(response => {
                assert.ok(response.body.id);
                planoId = response.body.id;

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
  });

  test('should allow customer to change card for current subscriptions', () => {
    return request(app)
      .post('/api/clientes/alteraCartao')
      .send({
        'cliente_id': clienteId,
        'cartao': {
          'numero': '5105105105105100',
          'expiracao_mes': 1,
          'expiracao_ano': 2020,
          'cvv': '456',
        },
      })
      .expect(200)
      .then(response => {
        assert.ok(response.body.id);
        let newCartaoId = response.body.id;

        /* return request(app)
          .get('/api/clientes/' + clienteId + '/assinaturas/')
          .expect(200)
          .then(response => {
            let assinaturas = response.body;
            console.log('result', assinaturas);
            for (let i = 0; i < assinaturas.length; i++) {
              assert.equal(assinaturas[i].cartao_id, newCartaoId);
            }
          }); */
      });
  });
});
