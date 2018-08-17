# MundiPaggi Integration

## Project requirements
- Docker
- Docker Compose

## Project setup

- Define environment variables in the .env file. See .env.example for environment variables names.
- Start with: docker-compose up -d
- Stop with: docker-compose down
- Default api endpoint: http://localhost:3000/api/


## API

- POST /clientes/
  
  Creates client.
  Input examples:

  ```
  {
    "nome": "fulano",
    "email": "fulano@gmail.com"
  }
  ```

- POST /clientes/{cliente_id}/cartoes
  
  Add card to client.
  Input examples:

  ```
  {
    'numero': '4012888888881881',
    'expiracao_mes': 12,
    'expiracao_ano': 2019,
    'cvv': '597',
  }
  ```

- POST /planos/

  Creates plan.
  Input examples:

  ```
  {
    'nome': 'Sanarflix Trimestral',
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
  }
  ```

- POST /pedidos/

  Creates subscription.
  Input examples:

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

  
  