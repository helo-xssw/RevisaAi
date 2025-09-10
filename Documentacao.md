# Documentação 📑
## Índice

- [1. Descrição Geral do Projeto](#1-descrição-geral-do-projeto)
  
  - [1.1 Nome do Projeto](#11-nome-do-projeto)
    
  - [1.2 Descrição do Produto](#12-descrição-do-produto)
    
  - [1.3 Objetivo](#13-objetivo)
    
  - [1.4 Motivação](#14-motivação)
    
  - [1.5 Equipe de Desenvolvimento](#15-equipe-de-desenvolvimento)
    
  - [1.6 Descrição dos Usuários Finais](#16-descrição-dos-usuários-finais)

  - [1.6.1 Motociclistas (Pessoas Físicas)](#161-motociclistas-pessoas-físicas)  

  - [1.6.2 Oficinas Mecânicas (Pessoas Jurídicas – CNPJs)](#162-oficinas-mecânicas-pessoas-jurídicas--cnpjs)  

- [2. Escopo](#2-escopo)
  
  - [2.1 Escopo Específico](#21-escopo-específico)
    
    - [2.1.1 Requisitos Funcionais](#211-requisitos-funcionais)
      
    - [2.1.2 Requisitos Não Funcionais](#212-requisitos-não-funcionais)
      
    - [2.1.3 Regras de Negócio](#213-regras-de-negócio)
      
  - [2.2 Escopo Futuro](#22-escopo-futuro)
    
    - [2.2.1 Requisitos Funcionais (Futuros)](#221-requisitos-funcionais-futuros)
      
    - [2.2.2 Requisitos Não Funcionais (Futuros)](#222-requisitos-não-funcionais-futuros)
      
    - [2.2.3 Regras de Negócio (Futuras)](#223-regras-de-negócio-futuras)  

- [3. Diagramas UML](#3-diagramas-uml)
  
  - [3.1 Casos de Uso](#31-casos-de-uso)
    
  - [3.2 Classes](#32-classes)

    
## 1. Descrição Geral do Projeto

### 1.1 Nome do Projeto

*RevisaAi*
<br>
<p align="center"> <img src="https://i.postimg.cc/cHyCBvMd/Sem-nome-512-x-512-px-2.png" alt="" width="200" /></p>
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
| Ennoile Raquel Martins Ferreira| xxxxx | xxxxxx |
| Heloíse Vitória Cruz Brito | xxxxx | xxxxx |
| Verissímo Casas | xxxxxx | xxxxxx | 

### 1.6 Descrição dos Usuários Finais

O aplicativo **RevisaAi** será utilizado por dois principais perfis de usuários:  

### 1.6.1 Motociclistas (Pessoas Físicas)  
- **Descrição:** Usuários que possuem e utilizam motocicletas em seu dia a dia, necessitando de auxílio no controle de revisões e manutenção preventiva.  
- **Principais Funcionalidades:**  
  - Cadastro de motos e atualização de quilometragem.  
  - Registro de revisões realizadas (troca de óleo, pneus, etc.).  
  - Recebimento de alertas sobre revisões futuras.  
  - Localização de oficinas mecânicas próximas.  
  - Consulta de histórico de serviços realizados.  

### 1.6.2 Oficinas Mecânicas (Pessoas Jurídicas – CNPJs)  
- **Descrição:** Estabelecimentos cadastrados no sistema que oferecem serviços de manutenção e reparo para motocicletas.  
- **Principais Funcionalidades:**  
  - Registro no aplicativo com informações do CNPJ.  
  - Cadastro de dados da oficina (endereço, telefone, horário de funcionamento).  
  - Gerenciamento de avaliações e comentários de clientes.  
  - Divulgação de sua localização no mapa integrado do aplicativo.  
  - Aumento da visibilidade perante motociclistas da região.  

## 2. Escopo

### 2.1 Escopo Específico

### 2.1.1 Requisitos Funcionais  

| ID   | Requisito Funcional | Descrição |
|------|----------------------|------------|
| RF01 | Cadastro de Usuário  | O sistema deve permitir que o motociclista crie uma conta com dados básicos (nome, e-mail, senha). |
| RF02 | Cadastro de Motos    | O usuário deve poder cadastrar informações sobre sua moto (modelo, ano, quilometragem atual). |
| RF03 | Registro de Revisões | O sistema deve permitir o registro de revisões realizadas (troca de óleo, pneus, etc.). |
| RF04 | Alertas de Manutenção | O sistema deve notificar o usuário sobre revisões futuras com base na quilometragem. |
| RF05 | Localização de Oficinas | O sistema deve permitir consultar oficinas mecânicas próximas via integração com API de mapas. |
| RF06 | Cadastro de Oficinas (PJ) | Oficinas devem poder se cadastrar informando CNPJ, endereço, telefone e horário de funcionamento. |
| RF07 | Avaliações de Oficinas | O sistema deve permitir que usuários avaliem e comentem sobre oficinas cadastradas. |
| RF08 | Consulta de Histórico | O usuário deve poder visualizar o histórico completo de revisões realizadas na moto. |

---

### 2.1.2 Requisitos Não Funcionais  

| ID    | Requisito Não Funcional | Descrição |
|-------|--------------------------|------------|
| RNF01 | Usabilidade | A interface deve ser intuitiva e acessível a usuários leigos em tecnologia. |
| RNF02 | Desempenho | O aplicativo deve responder às interações do usuário em até 2 segundos. |
| RNF03 | Segurança | Os dados de login e informações sensíveis devem ser armazenados de forma criptografada. |
| RNF04 | Disponibilidade | O sistema deve estar disponível 99% do tempo, exceto em períodos de manutenção programada. |
| RNF05 | Compatibilidade | O aplicativo deve ser compatível com dispositivos Android e iOS. |
| RNF06 | Escalabilidade | O sistema deve ser capaz de suportar aumento de usuários e oficinas sem perda significativa de desempenho. |

---

### 2.1.3 Regras de Negócio  

| ID   | Regra de Negócio | Descrição |
|------|------------------|------------|
| RN01 | Revisões por Quilometragem | O sistema deve utilizar valores padrão de referência (ex.: 1.000 km para primeira revisão, 3.000 km para revisões gerais, 1.000–2.000 km para troca de óleo), permitindo que o usuário personalize de acordo com o manual do fabricante da sua moto. |
| RN02 | Cadastro de Oficinas | Somente oficinas com CNPJ válido poderão se registrar no sistema. |
| RN03 | Atualização de Quilometragem | O usuário só pode atualizar a quilometragem da moto para valores superiores à última registrada. |
| RN04 | Avaliações de Oficinas | Usuários poderão avaliar oficinas somente após registrarem pelo menos uma revisão associada a essa oficina no aplicativo. |
| RN05 | Notificação de Revisões | O sistema deve emitir alertas quando a quilometragem atingir os limites configurados para cada tipo de revisão. Os valores padrão serão definidos pelo app, mas poderão ser ajustados pelo usuário. |


### 2.2 Escopo Futuro

O escopo futuro contempla funcionalidades que serão implementadas em versões posteriores do aplicativo, ampliando as capacidades do RevisaAi.  

---

### 2.2.1 Requisitos Funcionais (Futuros)  

| ID    | Requisito Funcional Futuro | Descrição |
|-------|-----------------------------|------------|
| RF09  | Registro de Abastecimentos | O usuário poderá registrar cada abastecimento, informando quilometragem, quantidade de combustível e valor pago. |
| RF10  | Cálculo de Consumo Médio | O sistema deve calcular automaticamente o consumo médio (km/L) com base nos abastecimentos cadastrados. |
| RF11  | Relatórios de Consumo | O sistema deve disponibilizar relatórios e gráficos sobre consumo de combustível, custo por km e eficiência média. |
| RF12  | Alertas de Baixo Desempenho | O sistema deve alertar o usuário quando o consumo estiver abaixo da média registrada, sugerindo uma revisão. |

---

### 2.2.2 Requisitos Não Funcionais (Futuros)  

| ID     | Requisito Não Funcional Futuro | Descrição |
|--------|---------------------------------|------------|
| RNF07  | Visualização de Gráficos | O sistema deve apresentar gráficos de consumo de forma clara e responsiva, acessível em dispositivos móveis. |
| RNF08  | Armazenamento de Dados | Os registros de consumo devem ser armazenados de forma segura no banco de dados em nuvem. |
| RNF09  | Integração Offline | O usuário poderá registrar abastecimentos mesmo sem internet; os dados serão sincronizados posteriormente. |
| RNF10  | Escalabilidade de Relatórios | O sistema deve suportar grande volume de registros de abastecimento sem perda de desempenho. |

---

### 2.2.3 Regras de Negócio (Futuras)  

| ID    | Regra de Negócio Futuro | Descrição |
|-------|--------------------------|------------|
| RN06  | Registro de Abastecimento Completo | Para calcular o consumo, o usuário deve informar obrigatoriamente quilometragem atual, litros abastecidos e valor pago. |
| RN07  | Cálculo de Consumo | O consumo médio será calculado dividindo a quilometragem percorrida pela quantidade de combustível abastecida (km/L). |
| RN08  | Consistência de Quilometragem | O sistema deve validar que a quilometragem informada em novos abastecimentos seja sempre superior à última registrada. |
| RN09  | Comparação de Eficiência | O sistema deve comparar automaticamente o consumo atual com a média histórica para identificar possíveis problemas mecânicos. |
| RN10  | Período de Relatório | O usuário poderá gerar relatórios de consumo em períodos configuráveis (semanal, mensal, personalizado).|

## 3. Diagramas UML

### 3.1 Casos de Uso

### 3.2 Classes 
