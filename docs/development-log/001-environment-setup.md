# DevFlow AI — Registro 001: Configuração do Ambiente

**Data:** 07/10/2026  
**Etapa:** Configuração inicial do ambiente de desenvolvimento

## Objetivo

Preparar o ambiente para desenvolver uma aplicação Full Stack utilizando Angular, Go e PostgreSQL, com futura integração de Inteligência Artificial.

## Tecnologias configuradas

- Go 1.27.1
- Node.js 24.21.0
- npm 11.12.1
- Angular CLI 22.2.2
- TypeScript
- SCSS

## Problema encontrado

Durante a primeira tentativa de instalação, o Angular CLI apresentou o aviso `EBADENGINE`, informando incompatibilidade com a versão Node.js 22.19.0.

## Solução aplicada

O Node.js foi atualizado para a versão 24.21.0, atendendo aos requisitos mínimos do Angular CLI.

Após a atualização, a criação da aplicação Angular e a instalação das dependências foram concluídas com sucesso.

## Decisões técnicas

- Utilizar Angular no Front-end e Go no Back-end.
- Adotar SCSS para organização dos estilos.
- Habilitar o roteamento da aplicação.
- Desabilitar SSR/SSG inicialmente, priorizando o desenvolvimento do dashboard interativo.
- Não configurar ferramentas de IA no Angular CLI neste primeiro momento.

## Próximos passos

- Validar a execução do Angular no navegador.
- Inicializar a API REST em Go.
- Estabelecer a primeira comunicação entre Front-end e Back-end.
- Criar a documentação da arquitetura do sistema.