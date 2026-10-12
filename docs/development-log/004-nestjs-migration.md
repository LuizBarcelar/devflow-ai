# 004 — Migração do Back-end Go para NestJS

**Data:** 11/10/2026

**Status:** Integração Angular + NestJS concluída

## Objetivo

Migrar o Back-end do DevFlow AI de Go para NestJS com TypeScript, mantendo o Front-end Angular e preservando o histórico de desenvolvimento.

## Tecnologias

- Angular 22
- NestJS com TypeScript
- ESM (ECMAScript Modules)
- Vitest
- Node.js
- SQLite e TypeORM (próxima etapa)

## Atividades realizadas

1. Criada a branch `migration/nestjs-sqlite`.
2. Preservado o código Go em `legacy/go-backend`.
3. Criado o projeto NestJS na pasta `backend`.
4. Configurado o prefixo global `/api`.
5. Configurado CORS para `http://localhost:4200`.
6. Implementado o endpoint `GET /api/health`.
7. Atualizado o serviço Health do Angular para consumir a API na porta `3000`.
8. Atualizados os textos do dashboard para identificar a integração Angular + NestJS.

## Validações realizadas

- NestJS iniciou sem erros de compilação.
- O endpoint `/api/health` retornou `status: ok`.
- O dashboard Angular exibiu a API como conectada.
- A interface continuou funcionando após a migração.

## Decisões técnicas

A adoção do NestJS permite utilizar TypeScript nas duas camadas da aplicação.

O código Go foi preservado como referência histórica.

A configuração do SQLite será realizada separadamente para facilitar testes e identificação de problemas.

## Próximos passos

1. Configurar SQLite e TypeORM.
2. Criar a entidade de projetos.
3. Implementar migrações de banco de dados.
4. Desenvolver endpoints CRUD.
5. Integrar os dados reais ao dashboard.