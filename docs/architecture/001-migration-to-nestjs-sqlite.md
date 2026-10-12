# ADR 001 — Migração para NestJS e SQLite

**Status:** Aceita

## Contexto

O DevFlow AI foi iniciado utilizando Angular no Front-end, Go no Back-end e PostgreSQL como banco de dados planejado.

Durante o desenvolvimento, identificou-se a oportunidade de simplificar a infraestrutura inicial e aproveitar uma arquitetura baseada em TypeScript.

## Decisão

Adotar as seguintes tecnologias:

- Angular 22 no Front-end.
- NestJS com TypeScript no Back-end.
- SQLite como banco de dados relacional.
- TypeORM como solução inicial de persistência.

## Justificativas

- Compartilhar a linguagem TypeScript entre Front-end e Back-end.
- Facilitar o desenvolvimento de módulos, serviços e validações.
- Reduzir a configuração necessária para o banco de dados local.
- Manter uma arquitetura organizada e adequada à evolução do projeto.

## Impactos

- Substituição gradual da API Go pela API NestJS.
- Adaptação do serviço HTTP utilizado pelo Angular.
- Atualização da documentação e das instruções de execução.
- Preservação do histórico de desenvolvimento anterior.

## Estratégia de migração

A migração será desenvolvida em uma branch específica.

A API Go será preservada até que a integração Angular + NestJS esteja validada.

Após os testes, a nova implementação será integrada à branch principal.

## Próximos passos

1. Configurar NestJS.
2. Implementar o endpoint de saúde.
3. Validar a comunicação com Angular.
4. Configurar SQLite e TypeORM.
5. Implementar o módulo de projetos.
6. Atualizar o README e concluir a migração.