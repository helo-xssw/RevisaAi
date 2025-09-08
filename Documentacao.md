# Documentação 📑
## Índice

- [1. Descrição Geral do Projeto](#1-descrição-geral-do-projeto).

  - [1.1 Nome do Projeto](#11-nome-do-projeto)

  - [1.2 Descrição do Produto](#descrição-do-produto)

  - [1.3 Objetivo](#objetivo)
  
  - [1.4 Motivação](#motivação)

  - [1.5 Equipe de Desenvolvimento](#equipe-de-desenvolvimento)

  - [1.6 Descrição dos Usuários Finais](#descrição-dos-usuários-finais)

- [2. Escopo ](#escopo)

	- [2.1 Escopo Específico](#escopo-específico)

		- [2.1.1 Requisitos Funcionais](#requisitos-funcionais)
    
		- [2.1.1 Requisitos Não Funcionais](#requisitos-não-funcionais)  
  
		- [2.1.3 Regras de Negócio](#regras-de-negócio)

  - [2.2 Escopo Futuro](#escopo-futuro)

    - [2.2.1 Requisitos Funcionais](#requisitos-funcionais)
    - [2.2.2 Requisitos Não Funcionais](#requisitos-não-funcionais)
    - [2.2.3 Regras de Negócio](#regras-de-negócio)

-  [3. Diagramas UML](#diagramas-uml)

   - [3.1 Casos de Uso](#casos-de-uso)
   - [3.2 Classes](#classes) 

    
## 1. Descrição Geral do Projeto

### 1.1 Nome do Projeto

*RevisaAi*

### Descrição do Produto

_**Aplicativo mobile**_ voltado para motociclistas, com foco no gerenciamento de revisões e manutenção da moto. O sistema permite registrar informações sobre quilometragem, trocas de óleo e demais revisões, além de localizar oficinas mecânicas próximas utilizando integração com serviços de mapas.

### Objetivo

O objetivo do projeto é desenvolver e manter um aplicativo simples, prático e eficiente que auxilie motociclistas no acompanhamento da manutenção de suas motos, evitando esquecimentos de revisões importantes e garantindo maior segurança e durabilidade do veículo. O app possibilita o registro de dados essenciais sobre a moto, geração de alertas de revisão e busca de oficinas. Futuramente, será incluída a funcionalidade de monitoramento do consumo de combustível, ampliando ainda mais os recursos de controle e gestão do usuário.

### Motivação 

A motivação central é atender à necessidade dos motociclistas que frequentemente enfrentam dificuldades em organizar e acompanhar as manutenções periódicas de suas motos, o que pode resultar em problemas mecânicos, aumento de custos e riscos à segurança. O RevisaAi surge como uma solução tecnológica acessível, intuitiva e centrada no usuário, oferecendo praticidade no dia a dia e contribuindo para a preservação da moto. Além disso, o aplicativo acompanha a crescente demanda por ferramentas digitais que auxiliem no gerenciamento de tarefas pessoais de forma rápida, confiável e integrada.

### Equipe de Desenvolvimento

| Nome do Integrante | Papéis | Responsabilidades |
|--------------------|--------|-------------------|
| Ennoile Raquel Martins | xxxxx | xxxxxx |
| Heloíse Vitória Cruz Brito | xxxxx | xxxxx |
| Verissímo Casas | xxxxxx | xxxxxx | 

### Descrição dos Usuários Finais

## Escopo

## Escopo Específico

### Requisitos Funcionais 

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


### Requisitos Não Funcionais 

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


### Regras de Negócio

## Escopo Futuro

### Requisitos Funcionais

### Requisitos Não Funcionais 

### Regras de Negócio 

## Diagramas UML

### Casos de Uso

### Classes 
