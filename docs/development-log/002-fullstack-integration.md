# Registro 002 — Primeira integração Full Stack

**Projeto:** DevFlow AI  
**Data:** 07/10/2026  
**Status:** Concluído

## Objetivo

Estabelecer a primeira comunicação entre o Front-end Angular e o Back-end Go por meio de uma API HTTP.

## Tecnologias utilizadas

- Angular 22 e TypeScript
- Go 1.27.1
- Angular HttpClient
- Angular Signals
- HTTP e JSON

## Implementação

**Back-end:** criação do endpoint `GET /api/health`, responsável por retornar o status da API em formato JSON.

**Front-end:** criação de um serviço Angular utilizando HttpClient para consultar a API.

**Interface:** utilização de Signals para atualizar o estado da conexão de maneira reativa.

**Comunicação:** configuração inicial de CORS para permitir requisições entre Angular e Go durante o desenvolvimento local.

## Problemas encontrados

1. Incompatibilidade entre a versão inicial do Node.js e o Angular CLI.
2. Conflito de portas durante a inicialização do Angular.
3. Erros de compilação causados por referências antigas no template Angular.

## Soluções aplicadas

- Atualização do Node.js para uma versão compatível.
- Ajuste da porta utilizada pelo Front-end.
- Correção dos arquivos `app.ts` e `app.html`, mantendo os imports necessários.

## Resultado

A aplicação Angular conseguiu consultar a API Go e apresentar a mensagem:

**API Go conectada com sucesso!**

A integração foi validada no navegador.

## Próximos passos

- Organizar o repositório Git.
- Criar o README principal.
- Implementar o layout inicial do dashboard.
- Preparar a integração com PostgreSQL.