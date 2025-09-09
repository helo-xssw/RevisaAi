# Documentação 📑
## Índice

- [1. Descrição Geral do Projeto](#1-descrição-geral-do-projeto)
  
  - [1.1 Nome do Projeto](#11-nome-do-projeto)
    
  - [1.2 Descrição do Produto](#12-descrição-do-produto)
    
  - [1.3 Objetivo](#13-objetivo)
    
  - [1.4 Motivação](#14-motivação)
    
  - [1.5 Equipe de Desenvolvimento](#15-equipe-de-desenvolvimento)
    
  - [1.6 Descrição dos Usuários Finais](#16-descrição-dos-usuários-finais)

- [2. Escopo](#2-escopo)
  
  - [2.1 Escopo Específico](#21-escopo-específico)
    
    - [2.1.1 Requisitos Funcionais](#211-requisitos-funcionais)
      
    - [2.1.2 Requisitos Não Funcionais](#212-requisitos-não-funcionais)
      
    - [2.1.3 Regras de Negócio](#213-regras-de-negócio)
      
  - [2.2 Escopo Futuro](#22-escopo-futuro)
    
    - [2.2.1 Requisitos Funcionais](#221-requisitos-funcionais)
      
    - [2.2.2 Requisitos Não Funcionais](#222-requisitos-não-funcionais)
      
    - [2.2.3 Regras de Negócio](#223-regras-de-negócio)

- [3. Diagramas UML](#3-diagramas-uml)
  
  - [3.1 Casos de Uso](#31-casos-de-uso)
    
  - [3.2 Classes](#32-classes)

    
## 1. Descrição Geral do Projeto

### 1.1 Nome do Projeto

*RevisaAi*
<br>
<p align="center"> <img src="" alt="" width="300" /></p>
<br>

### 1.2 Descrição do Produto

_**Aplicativo mobile**_ voltado para motociclistas, com foco no gerenciamento de revisões e manutenção da moto. O sistema permite registrar informações sobre quilometragem, trocas de óleo e demais revisões, além de localizar oficinas mecânicas próximas utilizando integração com serviços de mapas.

### 1.3 Objetivo

O objetivo do projeto é desenvolver e manter um aplicativo simples, prático e eficiente que auxilie motociclistas no acompanhamento da manutenção de suas motos, evitando esquecimentos de revisões importantes e garantindo maior segurança e durabilidade do veículo. O app possibilita o registro de dados essenciais sobre a moto, geração de alertas de revisão e busca de oficinas. Futuramente, será incluída a funcionalidade de monitoramento do consumo de combustível, ampliando ainda mais os recursos de controle e gestão do usuário.

### 1.4 Motivação 

A motivação central é atender à necessidade dos motociclistas que frequentemente enfrentam dificuldades em organizar e acompanhar as manutenções periódicas de suas motos, o que pode resultar em problemas mecânicos, aumento de custos e riscos à segurança. O RevisaAi surge como uma solução tecnológica acessível, intuitiva e centrada no usuário, oferecendo praticidade no dia a dia e contribuindo para a preservação da moto. Além disso, o aplicativo acompanha a crescente demanda por ferramentas digitais que auxiliem no gerenciamento de tarefas pessoais de forma rápida, confiável e integrada.

### 1.5 Equipe de Desenvolvimento

| Nome do Integrante | Papéis | Responsabilidades |
|--------------------|--------|-------------------|
| Ennoile Raquel Martins | xxxxx | xxxxxx |
| Heloíse Vitória Cruz Brito | xxxxx | xxxxx |
| Verissímo Casas | xxxxxx | xxxxxx | 

### 1.6 Descrição dos Usuários Finais

## 2. Escopo

### 2.1 Escopo Específico

### 2.1.1 Requisitos Funcionais 

| ID   | Descrição                                                                 | Prioridade |
|------|---------------------------------------------------------------------------|------------|
| RF01 | Permitir o cadastro de motos (marca, modelo, ano, quilometragem inicial).  | Alta       |
| RF02 | Registrar revisões realizadas (data, km, tipo de serviço, custo).          | Alta       |
| RF03 | Anexar imagens (nota fiscal, recibo) ao registro de revisão.               | Média      |
| RF04 | Gerar alertas automáticos de manutenção (óleo, revisão por km ou tempo).   | Alta       |
| RF05 | Exibir histórico de revisões em linha do tempo.                            | Média      |
| RF06 | Registrar abastecimentos (valor, litros, km, posto).                       | Alta       |
| RF07 | Calcular automaticamente consumo médio (km/L).                             | Alta       |
| RF08 | Gerar gráficos e relatórios de consumo e custos.                           | Média      |
| RF09 | Alertar usuário sobre queda significativa no consumo médio.                | Média      |
| RF10 | Exibir mapa com oficinas mecânicas próximas (API de mapas).                | Alta       |
| RF11 | Permitir busca de oficinas por filtros (autorizadas, 24h, especializadas). | Média      |
| RF12 | Salvar oficinas como favoritas.                                            | Média      |
| RF13 | Permitir avaliação de oficinas (nota e comentário).                        | Baixa      |
| RF14 | Permitir login/cadastro de usuário .                                       | Alta       |
| RF15 | Sincronizar dados na nuvem.                                                | Alta       |
| RF16 | Enviar notificações push (alertas de revisão/abastecimento).               | Alta       |


### 2.1.2 Requisitos Não Funcionais 

| ID    | Descrição                                                                 | Prioridade |
|-------|---------------------------------------------------------------------------|------------|
| RNF01 | Armazenar dados de forma segura e criptografada.                          | Alta       |
| RNF02 | Implementar autenticação via token seguro (OAuth 2.0).                    | Alta       |
| RNF03 | Dashboard inicial deve carregar em até 3 segundos.                        | Alta       |
| RNF04 | Interface responsiva e adaptada a diferentes telas (smartphones/tablets). | Alta       |
| RNF05 | Funcionar offline para registros e sincronizar quando houver internet.    | Alta       |
| RNF06 | Backup automático em nuvem para evitar perda de dados.                    | Média      |
| RNF07 | Compatibilidade com Android e iOS.                                        | Alta       |
| RNF08 | Arquitetura modular para futuras expansões (ex.: viagens).                | Média      |
| RNF09 | Código documentado e versionado (Git).                                    | Alta       |
| RNF10 | Utilizar arquitetura em camadas (MVC ou MVVM) para manutenção.            | Média      |


### 2.1.3 Regras de Negócio

### 2.2 Escopo Futuro

### 2.2.1 Requisitos Funcionais

### 2.2.2 Requisitos Não Funcionais 

### 2.2.3 Regras de Negócio 

## 3. Diagramas UML

### 3.1 Casos de Uso

### 3.2 Classes 
