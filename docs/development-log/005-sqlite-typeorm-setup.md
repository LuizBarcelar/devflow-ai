# 005 — Configuração do SQLite e TypeORM

**Projeto:** DevFlow AI  
**Data:** 12/10/2026  
**Status:** Concluído

## 1. Objetivo

Implementar a persistência inicial de dados no backend NestJS utilizando SQLite e TypeORM, com controle de alterações no esquema do banco por meio de migrações versionadas.

## 2. Tecnologias utilizadas

- NestJS — framework backend.
- TypeScript — linguagem de programação.
- TypeORM — mapeamento objeto-relacional (ORM).
- better-sqlite3 — driver de conexão com SQLite.
- SQLite — banco de dados relacional local.
- Vitest — testes automatizados.

## 3. Implementações realizadas

### Configuração do banco

Foi configurada a conexão entre NestJS, TypeORM e SQLite, utilizando o arquivo `backend/data/devflow.db`.

A sincronização automática do esquema foi desabilitada (`synchronize: false`) para permitir o gerenciamento controlado da estrutura do banco por migrações.

### Entidade Project

Foi criada a primeira entidade do sistema, responsável por representar projetos.

Campos implementados:

- `id`: identificador UUID.
- `name`: nome do projeto.
- `description`: descrição opcional.
- `status`: situação do projeto.
- `createdAt`: data de criação.
- `updatedAt`: data de atualização.

Os estados previstos para os projetos são `planning`, `in_progress` e `completed`.

### DataSource

Foi criado o arquivo `src/database/data-source.ts`, responsável por configurar a conexão utilizada pela CLI do TypeORM.

### Migração inicial

Foi implementada a migração `CreateProjectsTable1760223600000`, responsável por criar a tabela `projects`.

A migração foi executada com sucesso e registrada na tabela `migrations`.

## 4. Problemas encontrados e soluções

### Incompatibilidade do driver SQLite

**Problema:** a configuração com `sqlite3` apresentou incompatibilidade de tipagem com a versão instalada do TypeORM.

**Solução:** substituição do driver por `better-sqlite3`, utilizando `type: 'better-sqlite3'`.

### Teste unitário desatualizado

**Problema:** o teste padrão do NestJS ainda utilizava o método `getHello()`, removido durante a implementação do endpoint Health.

**Solução:** atualização do teste para validar `getHealth()` e o retorno esperado da API.

### Exportação duplicada do DataSource

**Problema:** a CLI do TypeORM identificou duas exportações da mesma instância de `DataSource`.

**Solução:** utilização de uma única exportação `default`.

### Expressões de data no SQLite

**Problema:** necessidade de adequar os valores padrão de `createdAt` e `updatedAt` à sintaxe aceita pelo SQLite.

**Solução:** utilização da expressão `(datetime('now'))` nas definições das colunas.

### Comandos de verificação no PowerShell

**Problema:** conflitos de interpretação de aspas em comandos JavaScript executados diretamente pelo terminal.

**Solução:** utilização de um script `.mjs` temporário para consultar a estrutura do banco, removido após a validação.

## 5. Validações realizadas

- Compilação TypeScript sem erros.
- Build do NestJS concluído.
- Teste unitário de Health aprovado com Vitest.
- DataSource reconhecido pela CLI do TypeORM.
- Migração inicial executada com sucesso.
- Tabela `projects` criada com seis colunas.
- Tabela `migrations` criada para controle de versões.
- Estrutura do banco consultada e validada.

## 6. Decisões técnicas

- Utilizar SQLite durante o desenvolvimento inicial.
- Manter o TypeORM como camada de persistência.
- Desabilitar a sincronização automática do esquema.
- Utilizar migrações versionadas.
- Manter o banco local fora do versionamento Git.
- Preservar o suporte a módulos ESM no backend.

## 7. Próximos passos

1. Implementar o módulo `Projects` no NestJS.
2. Criar o serviço responsável pelas operações de persistência.
3. Implementar endpoints REST para gerenciamento de projetos.
4. Adicionar validação de dados de entrada.
5. Criar testes para as operações de projetos.
6. Integrar os dados reais ao dashboard Angular.

## 8. Resultado

O DevFlow AI passou a contar com uma camada inicial de persistência relacional funcional, com estrutura de banco controlada por migrações e preparada para a implementação das funcionalidades de gerenciamento de projetos.