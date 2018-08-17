# MundiPagg Integration
- API for integrating to MundiPagg, an payment platform.
- Built with Loopback.js

## Project requirements
- Docker
- Docker Compose

## Project setup

- Define environment variables in the .env file. See .env.example for environment variables names.
- Start with: docker-compose up -d
- Stop with: docker-compose down
- Default api endpoint: http://localhost:3000/api/
- Explore api at (visible for debugging purposes): http://localhost:3000/explorer/

## Testing

- Tests made with Jest
- Steps to test:
  - docker exect -it mundipagg_api_container bash
  - npm test

## API

- POST /clientes/
  
  Creates client.
  Examples:

  ```
  {
    "nome": "fulano",
    "email": "fulano@gmail.com"
  }
  ```

- POST /clientes/{cliente_id}/cartoes
  
  Add card to client.
  Examples:

  ```
  {
    'numero': '4012888888881881',
    'expiracao_mes': 12,
    'expiracao_ano': 2019,
    'cvv': '597',
  }
  ```

- POST /clientes/alteraCartao
  
  Add card and use it on client's subscriptions.
  Examples:

  ```
  {
    'cliente_id': 'cus_XXXXXXXXXXX',
    'cartao': {
      'numero': '4012888888881881',
      'expiracao_mes': 12,
      'expiracao_ano': 2019,
      'cvv': '597',
    }
  }
  ```

- POST /planos/

  Creates plan.
  Examples:

  Some monthly plan.

  ```
  {
    'nome': 'Sanarflix',
    'intervalo': 'mensal',
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
  }
  ```

  Quartely plan for R$69,90.
  'contador_intervalo' defines recurrency period according to 'intervalo'.

  ```
  {
    'nome': 'Sanarflix Trimestral',
    'intervalo': 'mensal',
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
  }
  ```

  Package with regular plan + book. First month for R$164,40, following months for R$24,50.
  Property 'ciclos' defines how many times an item will be charged on this plan.

  ```
  {
    'nome': 'Sanarflix + Yellowbook',
    'intervalo': 'mensal',
    'contador_intervalo': 1,
    'dias_teste': 1,
    'itens': [
      {
        'nome': 'Sanarflix',
        'quantidade': 1,
        'preco': 2450,
        'tipo_preco': 'unidade',
      },
      {
        'nome': 'Yellowbook',
        'quantidade': 1,
        'preco': 13990,
        'tipo_preco': 'unidade',
        'ciclos': 1,
      },
    ],
  }
  ```

- POST /pedidos/

  Creates subscription.
  Examples:

  Subscribes new customer to some plan.

  ```
  {
    'cliente': {
      'nome': 'Mario',
      'email': 'mario@gmail.com',
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
        'plano_id': plan_XXXXXXXXXX,
      },
    ],
  }
  ```

  Subscribes existing customer to some plan.

  ```
  {
    'cliente_id': 'cus_XXXXXXXXXX',
    'cartao': {
      'numero': '4012888888881881',
      'expiracao_mes': 12,
      'expiracao_ano': 2019,
      'cvv': '597',
    },
    'produtos': [
      {
        'tipo': 'plano',
        'plano_id': plan_XXXXXXXXXX,
      },
    ],
  }
  ```


- DELETE /assinaturas/{assinatura_id}/cancela

  Cancels the subscription.

  