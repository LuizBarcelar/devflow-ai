
# DevFlow AI — Gerenciamento de Tarefas

## Objetivo

Implementar o gerenciamento completo de tarefas,
integrado aos projetos existentes.

## Backend

- Criação do TasksModule no NestJS.
- Implementação de endpoints REST.
- Validação de dados com class-validator.
- Persistência SQLite utilizando TypeORM.
- Relacionamento entre tarefas e projetos.
- Migration para criação da tabela tasks.
- Exclusão em cascata quando um projeto é removido.

## Frontend

- Criação da página de tarefas com Angular.
- Integração com a API REST.
- Formulário para criação e edição.
- Exclusão de tarefas.
- Filtros por projeto, status e prioridade.
- Indicadores de tarefas.
- Integração com a navegação lateral.

## Dashboard

- Indicadores reais de projetos ativos.
- Quantidade de tarefas concluídas.
- Quantidade de tarefas em andamento.
- Taxa de conclusão calculada dinamicamente.
- Estados de carregamento e erro.

## Validações realizadas

- Build do NestJS: aprovado.
- Build do Angular: aprovado.
- Vitest: 1 teste aprovado.
- CRUD de tarefas: validado manualmente.
- Integração Angular + NestJS + SQLite: validada.

## Melhorias futuras

- Testes automatizados para TasksService e TasksController.
- Paginação e ordenação.
- Busca por título.
- Indicadores gráficos.
- Autenticação e autorização.
```

## 2. Verificar alterações antes do commit

Na raiz do projeto:

```powershell
cd D:\Projetos\devflow-ai

git diff --check
git status --short
```

Se não houver erros, podemos registrar essa entrega.

## 3. Criar o commit

Como todas as alterações apresentadas pertencem à implementação de tarefas e à integração com o dashboard, podemos agrupá-las em um único commit de funcionalidade.

```powershell
git add backend/package.json backend/package-lock.json
git add backend/src
git add frontend/src/app
git add docs/development-log/tasks-management.md

git diff --cached --check
git diff --cached --stat

git commit -m "feat: implement tasks management and real dashboard metrics"
```

O comando `git diff --cached --stat` permite conferir os arquivos incluídos antes de criar o commit.

## 4. Publicar a branch no GitHub

Depois do commit:

```powershell
git push -u origin feature/tasks-management
```

Isso publica a implementação sem modificar imediatamente a branch `main`.

### O que teremos concluído

O DevFlow AI já contará com uma base Full Stack funcional: Angular no frontend, NestJS na API, SQLite com migrations, gerenciamento de projetos e tarefas, filtros e indicadores reais no dashboard.

**Minha recomendação é publicar essa entrega como uma feature independente e, antes de integrá-la à `main`, adicionar testes automatizados específicos para o módulo de tarefas e revisar as dependências sinalizadas pelo `npm audit`.** Assim, o projeto demonstra não apenas implementação de funcionalidades, mas também preocupação com qualidade e manutenção de software.