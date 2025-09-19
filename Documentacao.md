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
<p align="center"> <img src="https://i.postimg.cc/9XNfkBb6/Chat-GPT-Image-19-de-set-de-2025-00-12-23.png" alt="" width="200" /></p>
<br>

### 1.2 Descrição do Produto

_**Aplicativo mobile**_ voltado para motociclistas, com foco no gerenciamento de revisões e manutenção da moto. O sistema permite registrar informações sobre quilometragem, trocas de óleo e demais revisões, além de localizar oficinas mecânicas próximas utilizando integração com serviços de mapas.

### 1.3 Objetivo

O objetivo do projeto é desenvolver e manter um aplicativo simples, prático e eficiente que auxilie motociclistas no acompanhamento da manutenção de suas motos, evitando esquecimentos de revisões importantes e garantindo maior segurança e durabilidade do veículo. O app possibilita o registro de dados essenciais sobre a moto, a geração de alertas de revisão e a busca de oficinas. Neste primeiro momento, estará disponível apenas a funcionalidade de busca de oficinas, mas, caso seja viável nesta versão, será implementado também o cadastro de oficinas, permitindo que estabelecimentos se registrem, recebam comentários e avaliações dos usuários, oferecendo assim uma experiência mais completa. Futuramente, o aplicativo incluirá ainda a funcionalidade de monitoramento do consumo de combustível, ampliando os recursos de controle e gestão para os motociclistas.

### 1.4 Motivação 

A motivação central é atender à necessidade dos motociclistas que frequentemente enfrentam dificuldades em organizar e acompanhar as manutenções periódicas de suas motos, o que pode resultar em problemas mecânicos, aumento de custos e riscos à segurança. O RevisaAi surge como uma solução tecnológica acessível, intuitiva e centrada no usuário, oferecendo praticidade no dia a dia e contribuindo para a preservação da moto. Além disso, o aplicativo acompanha a crescente demanda por ferramentas digitais que auxiliem no gerenciamento de tarefas pessoais de forma rápida, confiável e integrada.

### 1.5 Equipe de Desenvolvimento

| Nome do Integrante | Papéis | Responsabilidades |
|--------------------|--------|-------------------|
| Ennoile Raquel Martins Ferreira| Analista / Gerente de Projeto / QA (Qualidade) | **Planejar** e **organizar** as tarefas da equipe (usando métodos ágeis como Scrum ou Kanban); **Documentar** requisitos, casos de uso e mudanças no escopo do projeto; **Realizar** **testes** funcionais e de usabilidade no app. |
| Heloíse Vitória Cruz Brito | Desenvolvedor Mobile (Frontend) | **Implementar** a **interface do usuário** (UI) seguindo os wireframes e protótipos; **Garantir** a **responsividade** e **usabilidade** do app em diferentes dispositivos; **Integrar** o frontend com a API/backend; **Corrigir** **bugs** de interface e aprimorar a experiência do usuário (UX).|
| Verissímo Rodrigues Casas | Desenvolvedor Backend / DevOps | **Projetar** e **implementar** a API e lógica de negócio do aplicativo; **Criar** e **gerenciar** o banco de dados; **Garantir** a segurança, escalabilidade e performance dos serviços de backend; **Implementar** autenticação, autorização e controle de acesso. | 

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
- **Descrição:** Estabelecimentos que poderão se cadastrar no aplicativo para oferecer serviços de manutenção e reparo de motocicletas. Neste momento, essa funcionalidade será considerada apenas se for viável nesta versão; caso contrário, será implementada em versões futuras.  
- **Principais Funcionalidades:**  
  - Registro no aplicativo com informações do CNPJ.  
  - Cadastro de dados da oficina (endereço, telefone, horário de funcionamento).  
  - Gerenciamento de avaliações e comentários de clientes.  
  - Divulgação de sua localização no mapa integrado do aplicativo.  
  - Aumento da visibilidade perante motociclistas da região.  

## 2. Escopo

### 2.1 Escopo Específico

### 2.1.1 Requisitos Funcionais  

| ID   | Requisito Funcional | Descrição | Prioridade | 
|------|----------------------|------------|----|
| RF01 | Cadastro de Usuário  | O sistema deve permitir que o motociclista crie uma conta com dados básicos (nome, e-mail, senha). | Alta |
| RF02 | Cadastro de Motos    | O usuário deve poder cadastrar informações sobre sua moto (modelo, ano, quilometragem atual). | Alta |
| RF03 | Registro de Revisões | O sistema deve permitir o registro de revisões realizadas (troca de óleo, pneus, etc.). | Alta |
| RF04 | Alertas de Manutenção | O sistema deve notificar o usuário sobre revisões futuras com base na quilometragem. | Alta |
| RF05 | Localização de Oficinas | O sistema deve permitir consultar oficinas mecânicas próximas via integração com API de mapas. | Média |
| RF06 | *Cadastro de Oficinas (PJ) | Oficinas devem poder se cadastrar informando CNPJ, endereço, telefone e horário de funcionamento. | Baixa |
| RF07 | *Avaliações de Oficinas | O sistema deve permitir que usuários avaliem e comentem sobre oficinas cadastradas. | Baixa |
| RF08 | Consulta de Histórico | O usuário deve poder visualizar o histórico completo de revisões realizadas na moto. | Média |

**Legenda:**  
Os requisitos marcados com `*` são opcionais nesta versão e **serão implementados apenas se houver viabilidade técnica e de tempo**.  

---

### 2.1.2 Requisitos Não Funcionais  

| ID    | Descrição | Categoria | Prioridade |
|-------|--------------------------|------------|----|
| RNF01 |A interface deve ser intuitiva e acessível a usuários leigos em tecnologia. |  Usabilidade | Alta |
| RNF02 | O aplicativo deve responder às interações do usuário em até 2 segundos. |  Desempenho | Alta |
| RNF03 | Os dados de login e informações sensíveis devem ser armazenados de forma criptografada. | Segurança | Alta |
| RNF04 | O sistema deve estar disponível para uso pelo menos 99% do tempo em um período mensal, considerando apenas indisponibilidades não programadas. Períodos de manutenção preventiva, previamente comunicados aos usuários, não serão contabilizados. | Disponibilidade | Alta |
| RNF05 | O aplicativo deve ser compatível com dispositivos Android, com suporte a partir da versão Android 8.0 (Oreo) ou superior. | Compatibilidade | Média |
| RNF06 |  O sistema deve armazenar todos os dados localmente no dispositivo, permitindo que todas as funcionalidades operem mesmo sem conexão à internet. Quando houver conexão, os dados devem ser sincronizados automaticamente com a nuvem, garantindo consistência, integridade e recuperação completa em caso de perda de dados no dispositivo. | Armazenamento Offline e Nuvem | Alta |

---

### 2.1.3 Regras de Negócio  

| ID   | Regra de Negócio | Descrição | Prioridade |
|------|------------------|------------|------|
| RN01 | Revisões por Quilometragem | O sistema deve utilizar valores padrão de referência (ex.: 1.000 km para primeira revisão, 3.000 km para revisões gerais, 1.000–2.000 km para troca de óleo), permitindo que o usuário personalize de acordo com o manual do fabricante da sua moto. | Alta |
| RN02 | *Cadastro de Oficinas | Somente oficinas com CNPJ válido poderão se registrar no sistema. | Média |
| RN03 | Atualização de Quilometragem | O usuário só pode atualizar a quilometragem da moto para valores superiores à última registrada. | Alta |
| RN04 | *Avaliações de Oficinas | Usuários poderão avaliar oficinas somente após registrarem pelo menos uma revisão associada a essa oficina no aplicativo. | Baixa |
| RN05 | Notificação de Revisões | O sistema deve emitir alertas quando a quilometragem atingir os limites configurados para cada tipo de revisão. Os valores padrão serão definidos pelo app, mas poderão ser ajustados pelo usuário. | Alta |

**Legenda:**  
As regras de negócio marcadas com `*` são opcionais nesta versão e **serão implementados apenas se houver viabilidade técnica e de tempo**.  

### 2.2 Escopo Futuro

O escopo futuro contempla funcionalidades que serão implementadas em versões posteriores do aplicativo, ampliando as capacidades do RevisaAi.  

---

### 2.2.1 Requisitos Funcionais (Futuros)  

| ID   | Requisito Funcional Futuro  | Descrição                                                                                                          | Prioridade |
| ---- | --------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------- |
| RF09 | Registro de Abastecimentos  | O usuário poderá registrar cada abastecimento, informando quilometragem, quantidade de combustível e valor pago.   | Alta       |
| RF10 | Cálculo de Consumo Médio    | O sistema deve calcular automaticamente o consumo médio (km/L) com base nos abastecimentos cadastrados.            | Alta       |
| RF11 | Relatórios de Consumo       | O sistema deve disponibilizar relatórios e gráficos sobre consumo de combustível, custo por km e eficiência média. | Média      |
| RF12 | Alertas de Baixo Desempenho | O sistema deve alertar o usuário quando o consumo estiver abaixo da média registrada, sugerindo uma revisão.       | Baixa      |

---

### 2.2.2 Requisitos Não Funcionais (Futuros)  

| ID    | Requisito Não Funcional Futuro | Descrição                                                                                                    | Categoria         | Prioridade |
| ----- | ------------------------------ | ------------------------------------------------------------------------------------------------------------ | ----------------- | ---------- |
| RNF07 | Visualização de Gráficos       | O sistema deve apresentar gráficos de consumo de forma clara e responsiva, acessível em dispositivos móveis. | Usabilidade       | Média      |
| RNF08 | Armazenamento de Dados         | Os registros de consumo devem ser armazenados de forma segura no banco de dados em nuvem.                    | Segurança / Dados | Alta       |
| RNF09 | Integração Offline             | O usuário poderá registrar abastecimentos mesmo sem internet; os dados serão sincronizados posteriormente.   | Confiabilidade    | Alta       |
| RNF10 | Escalabilidade de Relatórios   | O sistema deve suportar grande volume de registros de abastecimento sem perda de desempenho.                 | Performance       | Média      |


---

### 2.2.3 Regras de Negócio (Futuras)  

| ID   | Regra de Negócio Futuro            | Descrição                                                                                                                     | Prioridade |
| ---- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ---------- |
| RN06 | Registro de Abastecimento Completo | Para calcular o consumo, o usuário deve informar obrigatoriamente quilometragem atual, litros abastecidos e valor pago.       | **Alta**   |
| RN07 | Cálculo de Consumo                 | O consumo médio será calculado dividindo a quilometragem percorrida pela quantidade de combustível abastecida (km/L).         | **Alta**   |
| RN08 | Consistência de Quilometragem      | O sistema deve validar que a quilometragem informada em novos abastecimentos seja sempre superior à última registrada.        | **Alta**   |
| RN09 | Comparação de Eficiência           | O sistema deve comparar automaticamente o consumo atual com a média histórica para identificar possíveis problemas mecânicos. | **Média**  |
| RN10 | Período de Relatório               | O usuário poderá gerar relatórios de consumo em períodos configuráveis (semanal, mensal, personalizado).                      | **Média**  |


## 3. Diagramas UML

### 3.1 Casos de Uso
<br>
<p align="center"> <img src="https://i.postimg.cc/DzxbXf4G/Engenharia-drawio-1.png" alt="" width="500" /></p>
<br>
### 3.2 Classes 
