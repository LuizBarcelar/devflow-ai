# DevFlow AI — Visão Geral da Arquitetura

## Objetivo

Documentar a arquitetura inicial do DevFlow AI e sua evolução ao longo do desenvolvimento.

## Arquitetura atual

O sistema é composto por duas aplicações independentes:

**Angular — Front-end**
- Renderização da interface.
- Gerenciamento de estado com Signals.
- Comunicação HTTP por meio do HttpClient.

**Go — Back-end**
- Servidor HTTP.
- Definição de rotas.
- Handlers para processamento de requisições.
- Respostas em JSON.

## Fluxo de comunicação

```text
Usuário
   |
   v
Angular (localhost:4200)
   |
   | HTTP GET /api/health
   v
API Go (localhost:8080)
   |
   | JSON
   v
Angular HttpClient
   |
   v
Signal atualiza a interface
```

## Estrutura do repositório

```text
devflow-ai/
├── frontend/
├── backend/
│   ├── cmd/api/
│   └── internal/handlers/
├── docs/
│   ├── architecture/
│   └── development-log/
└── README.md
```

## Decisões técnicas

### Angular

Escolhido para desenvolver uma interface modular, reativa e escalável, utilizando TypeScript e componentes reutilizáveis.

### Go

Escolhido para implementar a API e explorar conceitos de desenvolvimento Back-end, organização de serviços e concorrência.

### PostgreSQL — Planejado

Será utilizado para armazenar usuários, projetos, tarefas e outros dados persistentes.

### Inteligência Artificial — Planejada

Será integrada por meio do Back-end Go, evitando a exposição de credenciais de serviços externos no navegador.

## Considerações de segurança

A configuração atual de CORS é destinada ao desenvolvimento local.

Antes da publicação, serão implementadas configurações por ambiente, validação de entradas, autenticação, autorização e tratamento adequado de erros.

## Próximas decisões

- Definir os modelos de dados.
- Escolher a estratégia de acesso ao PostgreSQL.
- Definir autenticação e autorização.
- Planejar os endpoints de projetos e tarefas.
- Definir a integração com o serviço de IA.