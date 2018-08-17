# Integração MundiPagg
- API para integração à plataforma de pagamento MundiPagg.
- Feita com [Loopback.js](https://loopback.io/)

## Requisitos do projeto
- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuração

- Defina as variaveis de ambiente no arquivo .env. Veja .env.example como arquivo de configuração de exemplo.
- Inicia com: docker-compose up -d (Usar flag --build para refletir mudanças)
- Encerra com: docker-compose down
- Endpoint padrão da api: http://localhost:3000/api/ (Configuração de host, porta em [server/config.json](https://loopback.io/doc/en/lb3/config.json.html))
- Explore a api em (visível somente para debug): http://localhost:3000/explorer/

## Teste

- Testes feitos com [Jest](https://jestjs.io/)
- Code Linting com [ESLint](https://eslint.org/)
- Passos:
  - docker exect -it mundipagg_api_container bash (Acessa o container da api)
  - npm test [caminho] (roda os testes para o caminho informado ou todos, caso o caminho seja omitido)
- Observação: o teste tests/challenges/case6.test.js falha por questão de concorrência nas requisições do script. Porém o caso de uso 6 é coberto na aplicação e pode ser testado manualmente.

## Premissas e observações

- Para o escopo desse projeto, foram implementados somente os métodos necessários para cobrir os casos de 1 a 6.
- Nomes dos modelos e seus atributos foram escritos em português para seguir os exemplos de entrada. Normalmente, seriam implementados em inglês.
- Como no exemplo de input do cartão não é informado o nome do titular, o nome do cliente é copiado para ser usado como nome do titular pois o parâmetro é obrigatório para a criação do cartão no Mundipagg. Para atender a validação do cartão o nome do cliente só pode conter letras com acentuação ou não. A acentuação é removida ao atribuir ao nome do titular.

## API

- POST /clientes/
  
  Cria cliente.
  Exemplos:

  ```
  {
    "nome": "fulano",
    "email": "fulano@gmail.com"
  }
  ```

- POST /clientes/{cliente_id}/cartoes
  
  Adiciona cartão ao cliente.
  Exemplos:

  ```
  {
    'numero': '4012888888881881',
    'expiracao_mes': 12,
    'expiracao_ano': 2019,
    'cvv': '597',
  }
  ```

- POST /clientes/alteraCartao
  
  Adiciona cartão e usa para as assinaturas do cliente.
  Exemplos:

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

  Cria um plano.
  Exemplos:

  Algum plano mensal.

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

  Plano trimestral por R$69,90.
  'contador_intervalo' define a recorrência para o 'intervalo' informado.

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

  Pacote com plano regular + livro. Primeiro mês por R$164,40, meses seguintes por R$24,50.
  Propriedade 'ciclos' define quantas vezes o item será cobrado neste plano, omitir para indicar cobrança até a assinatura ser cancelada.

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

  Cria assinatura(s). Outros tipos de produtos não são tratados por não caberem no escopo do projeto.
  Exemplos:

  Assina cliente no plano informado.

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

  Assina cliente existente no plano informado.

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

  Cancela a assinatura.

  