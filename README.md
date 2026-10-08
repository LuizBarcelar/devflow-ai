# DevFlow AI

**Plataforma inteligente de gerenciamento de projetos**

Projeto Full Stack em desenvolvimento, utilizando Angular, Go e PostgreSQL, com integração planejada de Inteligência Artificial.

## Sobre o projeto

O DevFlow AI é uma plataforma desenvolvida para centralizar o gerenciamento de projetos, organizar tarefas e acompanhar o progresso das atividades.

A proposta é integrar recursos de Inteligência Artificial para auxiliar no planejamento, identificar possíveis riscos e sugerir melhorias na execução dos projetos.

Além das funcionalidades do produto, este repositório documenta as decisões arquiteturais, os desafios técnicos e a evolução do desenvolvimento.

## Tecnologias

**Front-end**
- Angular 22
- TypeScript
- SCSS
- Angular Signals
- Angular HttpClient

**Back-end**
- Go 1.27
- Biblioteca HTTP padrão do Go
- API REST

**Planejadas**
- PostgreSQL
- Autenticação
- Integração com API de IA
- Three.js
- Docker
- CI/CD

## Funcionalidades

### Implementadas

- [x] Configuração do ambiente Angular e Go
- [x] Criação da API HTTP em Go
- [x] Endpoint de verificação de saúde da API
- [x] Comunicação entre Angular e Go
- [x] Exibição reativa do status da API com Angular Signals

### Planejadas

- [ ] Dashboard responsivo
- [ ] Cadastro e autenticação de usuários
- [ ] Gerenciamento de projetos
- [ ] Gerenciamento de tarefas
- [ ] Indicadores de produtividade
- [ ] Assistente com Inteligência Artificial
- [ ] Interface com elementos 3D
- [ ] Testes automatizados e CI/CD
- [ ] Publicação da aplicação

## Arquitetura

O projeto utiliza uma arquitetura com Front-end e Back-end separados.

O Angular é responsável pela interface e interação com o usuário, enquanto o Go disponibiliza os endpoints HTTP e implementará as regras de negócio.

Consulte [a documentação da arquitetura](docs/architecture/system-overview.md).

## Executando localmente

**Pré-requisitos:** Node.js compatível com Angular 22, npm e Go.

### Front-end

```bash
cd frontend
npm ci
npm start
```

A aplicação estará disponível em `http://localhost:4200`, caso a porta esteja livre.

### Back-end

```bash
cd backend
go run ./cmd/api
```

A API estará disponível em `http://localhost:8080`.

Endpoint de teste:

`GET http://localhost:8080/api/health`

**Observação:** a configuração inicial de CORS permite requisições de `http://localhost:4200`. Para utilizar outra porta, será necessário ajustar essa configuração.

## Evolução do desenvolvimento

O projeto é desenvolvido em etapas incrementais, com commits descritivos e registros técnicos.

- [Registro 001 — Configuração do ambiente](docs/development-log/001-environment-setup.md)
- [Registro 002 — Primeira integração Full Stack](docs/development-log/002-fullstack-integration.md)

## Objetivo profissional

Demonstrar competências práticas em desenvolvimento Full Stack, integração entre tecnologias, arquitetura de software, resolução de problemas, documentação técnica e construção de produtos digitais.

## Status

**Em desenvolvimento — Fundação Full Stack concluída.**