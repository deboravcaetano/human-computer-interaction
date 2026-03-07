# Relatório – Proposta de Interface (1ª Fase)

**Interface Pessoa-Máquina - LEI 25/26 2S**

---

<div align="center">


**Universidade do Minho**

Escola de Engenharia - Departamento de Informática

### Relatório - Proposta de Interface

**Interface Pessoa-Máquina - 1ª Fase**

Débora Caetano - a112332  
Fábio Azevedo - a111002  
Gonçalo Lemos - a111759

[Protótipo Figma](https://www.figma.com/design/NQBXjODff0A4EqM7TQejJt/Projeto-IPM---dfg?node-id=0-1&t=lLzim3W78ALdneHY-1) 

Ano Letivo 2025/2026 - 2.º Semestre

Março 2026

</div>

---

## Introdução

No âmbito deste trabalho prático, foi prototipada uma interface de visualização de dados inspirada no *EU Recovery and Resilience Scoreboard*, que permite analisar o progresso dos Planos Nacionais de Recuperação e Resiliência dos Estados-Membros da União Europeia. Neste documento, apresenta-se a interface modelada com recurso à ferramenta Figma [\[1\]](#referências), justificando as várias decisões tomadas face aos perfis dos utilizadores da aplicação. Perante o grande volume de dados e dos seus tipos diferentes, (marcos, metas, indicadores comuns e fluxos financeiros) o principal foco do desenvolvimento desta interface foi a apresentação desta informação de uma forma clara, acessível e sem sobrecarregar o utilizador, adotando uma estratégia de revelação progressiva (*progressive disclosure*). Foi também realizada uma avaliação da interface apresentada, fazendo uso das heurísticas de Nielsen [\[2\]](#referências). Apesar de algumas limitações da ferramenta de modelação, julga-se ter construído um protótipo de uma interface que cumpre os objetivos do enunciado, e que se encontra suficientemente detalhado para a sua implementação.

---

## Índice

- [1. Análise do Problema e do Domínio](#1-analise-do-problema-e-do-dominio)
  - [1.1 Tipos de Dados Relevantes](#11-tipos-de-dados-relevantes)
  - [1.2 Principais Desafios de Usabilidade](#12-principais-desafios-de-usabilidade)

- [2. Utilizadores e Levantamento de Requisitos](#2-utilizadores-e-levantamento-de-requisitos)
  - [2.1 Perfis de Utilizador e Necessidades Identificadas](#21-perfis-de-utilizador-e-necessidades-identificadas)
  - [2.2 Requisitos Funcionais](#22-requisitos-funcionais)

- [3. Apresentação da Interface Desenvolvida](#3-apresentacao-da-interface-desenvolvida)
  - [3.1 Página Dashboard](#31-página-dashboard)
  - [3.2 Página Lista de Países](#32-página-lista-de-países)
  - [3.3 Página Detalhe de País](#33-página-detalhe-de-país)
    - [3.3.1 Separador Sumário](#331-separador-sumário)
    - [3.3.2 Separador Pilares](#332-separador-pilares)
  - [3.4 Funcionalidade Comparar Países](#34-funcionalidade-comparar-países)
  - [3.5 Página Execução](#35-página-execução)
    - [3.5.1 Visão Geral de Execução](#351-visão-geral-de-execução)
    - [3.5.2 Metas e Marcos](#352-metas-e-marcos)
    - [3.5.3 Desembolsos](#353-desembolsos)
  - [3.6 Página Indicadores](#36-página-indicadores)
  - [3.7 Página Pilares](#37-página-pilares)
  - [3.8 Histórico de Revisões de Planos](#38-histórico-de-revisões-de-planos)
    - [3.8.1 Visibilidade do Estado do Sistema](#381-visibilidade-do-estado-do-sistema)
    - [3.8.2 Opção de Filtrar](#382-opção-de-filtrar)
  - [3.9 Rodapé (Footer)](#39-rodapé-footer)

- [4. Avaliação Heurística](#4-avaliacao-heuristica)
  - [4.1 Visibilidade do Estado do Sistema](#41-visibilidade-do-estado-do-sistema)
  - [4.2 Correspondência com o Mundo Real e Reconhecimento em vez de Recordação](#42-correspondência-com-o-mundo-real-e-reconhecimento-em-vez-de-recordação)
  - [4.3 Controlo, Liberdade e Flexibilidade de Utilização](#43-controlo-liberdade-e-flexibilidade-de-utilização)
  - [4.4 Consistência e Normas](#44-consistência-e-normas)
  - [4.5 Prevenção e Recuperação de Erros, Ajuda e Documentação](#45-prevenção-e-recuperação-de-erros-ajuda-e-documentação)
  - [4.6 Estética e Desenho Minimalista](#46-estética-e-desenho-minimalista)

- [5. Conclusão e Trabalho Futuro](#5-conclusão-e-trabalho-futuro)

- [Referências](#referências)
---

## 1. Análise do Problema e do Domínio

O Mecanismo de Recuperação e Resiliência (MRR) constitui o instrumento central do programa *NextGenerationEU*, dotado de cerca de 724 mil milhões de euros em subvenções e empréstimos. Cada Estado-Membro submete um Plano Nacional de Recuperação e Resiliência (PRR) que define reformas e investimentos organizados em pilares temáticos, como a transição ecológica, a transformação digital, a coesão social e territorial, a saúde e resiliência, entre outros. O acompanhamento da execução destes planos gera um volume considerável de dados heterogéneos, cuja análise requer ferramentas de visualização adequadas [\[4\]](#referências).

### 1.1 Tipos de Dados Relevantes

A interface proposta trabalha sobre três categorias principais de dados, disponibilizadas pelo *EU Recovery and Resilience Scoreboard*:

- **Marcos e Metas (*Milestones and Targets*):** objetivos concretos que cada país se compromete a atingir, com descrição, prazo e estado de execução. Na interface, estes dados são apresentados sob a forma de percentagens de progresso (e.g., "75% 39/52 Metas concluídas") e gráficos do tipo *donut* que ilustram o estado dos marcos (concluídos vs. em progresso).

- **Indicadores Comuns (*Common Indicators*):** conjunto de 14 indicadores de reporte obrigatório e semestral por todos os Estados-Membros, que permitem comparações transversais. A interface disponibiliza uma vista dedicada (separador "Indicadores") para consulta e filtragem destes dados.

- **Desembolsos e Beneficiários (*Disbursements*):** informação financeira detalhada sobre os pagamentos efetuados pela UE a cada país, incluindo montantes de apoios a fundo perdido, empréstimos atribuídos e alocação em relação ao PIB. Na interface, estes valores são apresentados em cartões de resumo na página de detalhe de cada país.

### 1.2 Principais Desafios de Usabilidade

Durante a conceção da interface, foram identificados os seguintes desafios:

- **Volume e complexidade dos dados:** a quantidade de indicadores, marcos e fluxos financeiros exige uma hierarquia de informação clara, evitando sobrecarregar o utilizador. Optou-se por uma estrutura em camadas: visão geral no *dashboard*, detalhe progressivo por país e separadores temáticos (Sumário, Pilares, Indicadores).

- **Heterogeneidade dos perfis de utilizador:**  desde analistas com elevada literacia de dados até utilizadores menos técnicos, a interface deve ser simultaneamente rica e acessível. Foram adotados resumos visuais (percentagens, gráficos circulares) com possibilidade de aprofundamento.

- **Comparação entre países:**  a necessidade de confrontar a execução de diferentes Estados-Membros motivou a inclusão de uma funcionalidade de comparação lado a lado, com seleção interativa de países e visualização paralela dos pilares.

- **Exportação e reutilização:** vários perfis necessitam de extrair dados para análise externa ou apresentações, o que levou à inclusão de botões de exportação em múltiplas vistas da interface.

---

## 2. Utilizadores e Levantamento de Requisitos

### 2.1 Perfis de Utilizador e Necessidades Identificadas

Foram considerados três perfis de utilizador com contextos e objetivos distintos, cuja análise orientou todas as decisões de design da interface.

#### 2.1.1 Helena Vasconcelos - Analista de Políticas Públicas

- Exportação de dados em formatos editáveis (CSV, JSON) para cruzamento com outras fontes;
- Acesso a metas específicas por setor (e.g., digitalização) e histórico de revisões de planos;
- Filtragem avançada por múltiplos critérios em simultâneo (país, pilar, período temporal).

#### 2.1.2 Marco Rossi - Empreendedor em Energias Renováveis

- Visualizações claras de investimento por pilar e datas de desembolso previstas;
- Identificar quais os países com maior investimento em transição ecológica;
- Gráficos exportáveis para utilização em apresentações de *pitch* a investidores.

#### 2.1.3 Clara Mendes - Professora do Ensino Secundário

- Linguagem clara e sucinta, com infográficos intuitivos e resumos do impacto direto no quotidiano;
- Comparação regional (e.g., investimentos em *Policies for the Next Generation* entre Portugal e Espanha);
- Compreender se atrasos em promessas concretas (e.g., renovação de escolas) são um problema local ou generalizado.

### 2.2 Requisitos Funcionais

A partir da análise dos três perfis de utilizador, foram derivados os seguintes requisitos funcionais:

1. Filtrar dados por país, pilar temático, tipo de indicador e período temporal.
2. Visualizar o progresso de marcos e metas através de gráficos interativos.
3. Exportar dados em formato CSV, JSON e Excel.
4. Comparar dois países lado a lado com dados alinhados.
5. Pesquisar países por nome com filtragem dinâmica.
6. Ordenar listas de países por diferentes critérios (nome, execução, desembolsos).
7. Aceder a documentação contextual sobre o MRR e a metodologia dos indicadores.
8. Consultar detalhes de indicadores com *tooltips* explicativas.
9. Navegar entre secções sem perder o contexto da análise em curso.

---

## 3. Apresentação da Interface Desenvolvida

A interface da plataforma encontra-se organizada em diferentes páginas, cada uma dedicada a um conjunto específico de funcionalidades relacionadas 
com a exploração dos dados do PRR.

No topo da aplicação encontra-se uma barra de navegação que permite aceder rapidamente às principais secções da plataforma, incluindo o 
dashboard principal, a lista de países, a página de execução, os indicadores e os pilares.

Esta organização procura facilitar a navegação e garantir que os utilizadores conseguem encontrar rapidamente a informação pretendida.

### 3.1 Página "Dashboard"

O dashboard constitui a página inicial da plataforma e apresenta uma visão geral do estado de implementação dos planos de recuperação na União Europeia.

Nesta página são apresentados diferentes elementos visuais que sintetizam informação relevante, incluindo o montante total de investimento aprovado, a percentagem média de execução dos planos e a distribuição dos investimentos pelos diferentes pilares estratégicos definidos pela União Europeia.

Estes elementos permitem ao utilizador obter rapidamente uma compreensão global da situação atual, funcionando como ponto de partida para uma exploração mais detalhada dos dados disponíveis na plataforma.


**Figura 1:** Captura de ecrã do protótipo da página "Dashboard".

A página é constituída por três elementos principais. No topo, uma barra de navegação horizontal permanente permite aceder a todas as secções da aplicação: *Home*, *Países*, *Execução*, *Indicadores* e *Pilares*. A entrada *Execução* inclui um *dropdown* com sub-secções, Visão geral, Metas e Marcos, Desembolsos e Linha Temporal, permitindo aceder diretamente ao tipo de análise pretendido. A página onde o utilizador se encontra é realçada com uma cor de fundo diferente das restantes, para que o utilizador saiba sempre em que secção está, uma decisão consistente com o que se observa em diversas outras interfaces *web*.

Abaixo da barra de navegação, são apresentados três cartões de resumo com indicadores-chave: o total de fundos alocados ao MRR, a percentagem de execução europeia e o número de beneficiários/projetos. Estes cartões permitem que o utilizador, num relance, avalie o estado global do programa sem necessidade de interação adicional, algo especialmente importante para o perfil da Clara, que pode ter menos disponibilidade para explorações aprofundadas.

Abaixo dos cartões de indicadores globais, incluímos uma secção de 'Top 3', que destaca os Estados-Membros com maior execução através de cartões detalhados. Esta escolha reduz a carga cognitiva, permitindo que utilizadores como a Clara identifiquem sucessos regionais sem navegar por tabelas complexas.


**Figura 2:** Top 3.

Abaixo dos cartões de indicadores globais, incluímos uma secção de 'Top 3', que destaca os Estados-Membros com maior execução através de cartões detalhados. Esta escolha reduz a carga cognitiva, permitindo que utilizadores como a Clara identifiquem sucessos regionais sem navegar por tabelas complexas.

**Figura 3:** Linha Temporal.

Adicionalmente, implementámos uma Linha Temporal de 'Últimas Notícias'. Esta componente de feed informativo permite que a Helena acompanhe revisões de planos e novos pedidos de pagamento em tempo real, garantindo que o sistema comunica a visibilidade do estado do sistema de forma cronológica. A página encerra com um rodapé funcional que centraliza as opções de ajuda e exportação de dados globais.


### 3.2 Página "Lista de Países"

A página 'Países' constitui o motor de exploração detalhada da aplicação, apresentando todos os Estados-Membros através de um sistema de cartões individuais que privilegia a legibilidade e o acesso rápido à informação. Em vez de uma navegação geográfica, optou-se por uma estrutura de lista vertical que permite ao utilizador processar uma maior densidade de dados sem distrações visuais.


**Figura 4:** Captura de ecrã do protótipo da página "Lista de Países".

Cada cartão de país apresenta elementos críticos para uma avaliação imediata: a bandeira e nome do país, uma barra de progresso de 'Evolução geral', o valor do PIB (acompanhado por um ícone de informação para apoio contextual) e a data da 'Última atualização'. Esta organização suporta diretamente o perfil da Helena, que necessita de verificar rapidamente o histórico de revisões e a frescura dos dados. 

A utilização de bandeiras em conjunto com os nomes dos países garante que o utilizador não precise de memorizar códigos ISO ou abreviaturas (princípio do reconhecimento em vez de recordação).

Para garantir o controlo e flexibilidade de utilização (Heurística 3), a página inclui:

- **Barra de Pesquisa Dinâmica**: Embora todos os países sejam visíveis na lista, a escala da listagem, 27 Estados-Membros, pode exigir esforço de
navegação visual quando o utilizador já sabe o país que pretende consultar.

A barra de pesquisa serve assim utilizadores em modo de *localização direta*, como a **Helena** ou o **Marco**, que acedem frequentemente a países
específicos sem querer percorrer a lista completa, enquanto a listagem serve utilizadores em modo de *exploração*, cobrindo dois padrões de uso
distintos sem conflito entre si. 

Ao clicar no campo de pesquisa, é apresentada de imediato uma lista de todos os países disponíveis, permitindo selecionar diretamente sem necessidade de digitar. 
À medida que o utilizador escreve, a lista é progressivamente filtrada em tempo real, combinando a conveniência do reconhecimento visual com a eficiência da pesquisa por texto.

- **Ordenação Inteligente**: Um menu dropdown no topo direito permite reorganizar a lista (e.g., por nome ou execução), facilitando a identificação de líderes e retardatários no processo de recuperação.

- **Acesso à Comparação**: O botão 'Comparar', posicionado de forma destacada acima da lista, serve como o ponto de entrada para o fluxo de análise
binária entre países, um requisito fundamental para os perfis do Marco e da Clara.

- **Acesso ao Histórico**: A página inclui um ponto de acesso global ao 'Histórico de Revisões'. Este botão, permite que utilizadores como a **Helena** transitem de uma visão focada em países para uma visão cronológica e transversal de todos os pedidos, facilitando a auditoria de alterações recentes nos planos.

Atualmente, a seleção de um país para consulta de detalhes é feita através da interação direta com o cartão correspondente na lista. Embora o protótipo estático mostre os dados de forma clara, preve-se para a 2ª fase de implementação a introdução de feedback visual dinâmico: ao sobrevoar um cartão com o cursor, este mudará subtilmente de tom ou ganhará um destaque (elevação), sinalizando de forma inequívoca que o elemento é clicável.

### 3.3 Página "Detalhe de País"

Ao selecionar um país através da lista ou da pesquisa, o utilizador é redirecionado para a página de detalhe, o elemento central da interface. Esta página adota uma estratégia de revelação progressiva vertical, apresentando inicialmente o Sumário com os indicadores financeiros e de execução mais críticos.

#### 3.3.1 Separador "Sumário"

Ao entrar no detalhe de um país, o utilizador depara-se com um resumo focado no impacto financeiro e na execução.

**Figura 5:** Página de detalhe de um país.

No topo, a interface apresenta o progresso do plano de forma textual e visual (ex: "75% - Metas concluídas") através de uma barra de progresso linear. Esta escolha de design substitui gráficos circulares mais complexos por uma representação horizontal que facilita a leitura rápida do avanço do país.

Logo, três cartões principais apresentam: o Total Recebido, a Alocação PRR em relação ao PIB e o número de Projetos Ativos.

Junto a métricas que podem ser menos intuitivas, como o valor do PIB, são colocados ícones de informação ("i") que, ao serem sobrevoados, revelam tooltips explicativas. Este detalhe é particularmente importante para o perfil da Clara, que pode não estar familiarizada com estes conceitos financeiros e beneficia de ajuda contextual imediata.

Para complementar os dados estatísticos, foi incluída a secção "Últimos avanços", que apresenta uma linha temporal dos marcos e metas atingidos recentemente. Esta componente permite que a Helena visualize o histórico de execução de forma cronológica, oferecendo uma maior transparência sobre o ritmo de implementação do PRR no país selecionado. Toda esta informação é apresentada antes da secção expandível, acedida através do botão "Ver Mais", garantindo que o utilizador tem primeiro acesso aos dados mais relevantes.

Quando o utilizador clica em "Ver Mais", é apresentada uma nova vista onde este deve primeiro selecionar um pilar ou navegar para a secção de
Indicadores. Após selecionar um pilar, a página apresenta a informação detalhada do país para esse pilar específico.

**Figura 6:** Página de detalhe de um país - separador "Pilares".

#### 3.3.2 Separador "Pilares"

O utilizador dispõe sempre de um botão "Mostrar Pilares" que expande ou recolhe um painel de seleção, permitindo-lhe trocar de pilar a qualquermomento sem perder o contexto da página. Esta decisão de design evita que o utilizador tenha de navegar para trás para mudar de pilar, reduzindo a fricção na exploração comparativa entre pilares, respondendo diretamente às necessidades do **Marco Rossi**, que pretende identificar em quais áreas dos diferentes pilares deve expandir a sua empresa, e da **Helena**, que
necessita de acesso rápido a metas específicas por setor.

Cada pilar é representado como um *card* clicável com ícone e nome. 

A figura seguinte mostra a vista de seleção de pilares:

**Figura 7:** Informação detalhada do pilar selecionado, exemplificada com o pilar de Transição Ecológica para Portugal.

Após a seleção de um pilar, a página organiza-se em duas zonas principais.

No topo, um cartão descritivo contextualiza o pilar selecionado, no caso da Transição Ecológica, é explicado o enquadramento no Pacto Ecológico
Europeu e os domínios de foco (energias renováveis, eficiência energética, mobilidade sustentável e biodiversidade). Esta descrição introdutória serve
especialmente o perfil da **Clara Mendes**, que beneficia de linguagem clarae acessível antes de ser exposta a dados quantitativos.

De seguida, é apresentada a secção **Regra dos 37%**, que comunica de forma imediata o desempenho do país face ao mínimo obrigatório. Portugal
aloca 43% da sua dotação total (€9,6B) a medidas climáticas, num plano total de €22,2B, superando o limiar de 37% em 6,2 p.p., o que lhe valeu
o 1.º lugar no ranking da UE. 

Esta classificação é apresentada como um *badge* junto ao nome do país, permitindo que o **Marco Rossi** identifique
de imediato quais os países que lideram o investimento em cada pilar, sem necessidade de consultar tabelas comparativas separadas. 

A barra de progresso horizontal situa visualmente o valor de 43% face ao mínimo e ao máximo possível, tornando a leitura intuitiva mesmo para utilizadores
menos familiarizados com dados financeiros.

A secção **Distribuição do Investimento por Área** apresenta quatro painéis
em grelha que aprofundam a análise:

- **Rastreio Climático - Despesa por Área de Política**: barras horizontais ordenadas por valor mostram a percentagem da dotação total afeta a cada
área climática. A Eficiência Energética domina com 49,4%, seguida de I&D em atividades verdes (18%), Mobilidade Sustentável (10,8%), Energia
Renovável e Redes (9,3%), Adaptação às alterações climáticas (8,1%), Proteção e Restauro da Biodiversidade (2,1%) e Transição para a Economia
Circular (0,8%). Esta granularidade responde à necessidade da **Helena** de aceder a metas específicas por setor.

- **Estado dos Marcos e Metas**: um gráfico de anel indica que 48% dos marcos estão concluídos (98 concluídos, 106 não avaliados, num total de
204). Esta visão agregada permite à **Clara** perceber se os atrasos que sente localmente refletem um padrão mais amplo, e à **Helena** monitorizar
o progresso real face aos compromissos assumidos.

- **Pilar Transição Verde - Despesa por Área de Política**: perspetiva complementar ao rastreio climático, apresentando a contribuição por área
segundo a classificação da Comissão Europeia. A Eficiência Energética mantém-se dominante com 57,0%, seguida de Energia Renovável e Redes
(9,3%), I&D em atividades verdes (18%), Mobilidade Sustentável (8,5%), Adaptação às alterações climáticas (8,1%), Proteção e Restauro da
Biodiversidade (2,1%) e Transição para a Economia Circular (0,8%).

- **Marcos por Tipo de Medida**: um gráfico de barras verticais separa os 204 marcos totais entre investimentos (175) e reformas (29), permitindo
ao **Marco Rossi** avaliar rapidamente a natureza das medidas em curso e a sua relevância para decisões de expansão empresarial.

**Figura 8:** Página global do pilar, acessível ao clicar no *badge* de posicionamento no ranking (ex: "1.º lugar no ranking da UE").

Ao clicar no *badge* de posicionamento apresentado na página de detalhe do país, o utilizador é redirecionado para a página global do pilar, que agrega
a informação de todos os Estados-Membros numa visão comparativa europeia.

### 3.4 Funcionalidade "Comparar Países"

Uma das funcionalidades mais relevantes da interface é a possibilidade de comparar dois países lado a lado. Esta funcionalidade pode ser iniciada a
partir de um botão "Comparar" disponível na lista de países ou na página de detalhe de um país

O comportamento do diálogo de seleção adapta-se consoante o ponto de
entrada:

- **A partir da lista de países**: o utilizador vê um único campo de pesquisa
  e deve selecionar dois países distintos. À medida que seleciona cada país,
  este aparece como uma *tag* removível, permitindo que o utilizador desfaça
  a escolha caso pretenda substituir um dos países. Não é possível selecionar
  o mesmo país duas vezes, prevenindo comparações inválidas.

- **A partir da página de detalhe de um país**: o país atualmente visualizado
  surge pré-selecionado e fixo, não podendo ser removido. O utilizador apenas
  necessita de escolher um segundo país através do campo de pesquisa,
  reduzindo o número de passos necessários e evitando erros de contexto,
  uma decisão de design que respeita o princípio de reconhecimento em vez de
  recordação, uma vez que o utilizador não precisa de se lembrar do país que
  estava a consultar.

Em ambos os casos, o botão "Comparar" só fica ativo quando dois países distintos estão selecionados; caso contrário, permanece desativado, com uma
*tooltip* a indicar "Selecione dois países para prosseguir". 

Este mecanismo de prevenção de erros evita que o utilizador inicie uma comparação incompleta.

Importa ainda referir que o campo de pesquisa, ao ser clicado, apresenta uma lista pré-carregada de todos os
Estados-Membros da UE, facilitando a seleção mesmo quando o utilizador não se recorda do nome exato de todos os países disponíveis. A lista é
progressivamente filtrada à medida que o utilizador digita, combinando assim a conveniência do reconhecimento visual com a eficiência da pesquisa por texto.

**Figura 8:** Vista de comparação lado a lado entre dois países.

A vista de comparação organiza-se em três separadores: **Sumário**, **Pilares** e **Indicadores**, permitindo ao utilizador navegar entre
diferentes níveis de detalhe sem abandonar o contexto de comparação.

No separador **Sumário**, os dois países são apresentados em cartões paralelos com fundo escuro, exibindo de forma imediata a percentagem de
metas concluídas e o número absoluto. Esta disposição lado a lado permite que a **Clara Mendes** compare instantaneamente o desempenho entre países sem
necessidade de memorizar valores ou alternar entre páginas, respeitando o princípio de reconhecimento em vez de recordação.

Abaixo, o painel **Estado dos Marcos** apresenta dois gráficos semicirculares simétricos, um por país, mostrando a proporção entre marcos em progresso
(60%) e concluídos (40%) para ambos os países. A legenda partilhada entre os dois gráficos reforça a consistência visual e facilita a leitura comparativa.

Seguem-se dois painéis adicionais:

- **Como o Plano de Recuperação e Resiliência é distribuído?**: um gráfico
  circular mostra o peso relativo de cada país no total europeu contextualizando
  a dimensão de cada plano nacional no conjunto europeu.

- **Total de empréstimos atribuídos**: um gráfico de barras verticais compara
  diretamente os montantes de empréstimos de cada país, com cada país codificado por cor
  distinta, mantendo essa codificação de forma consistente ao longo de toda
  a vista.

No rodapé da página, o botão **"Voltar"** permite regressar à lista de países, enquanto o botão **"Exportar"** possibilita a exportação dos dados
comparativos, respondendo diretamente à necessidade do **Marco Rossi** de obter gráficos exportáveis para apresentações de pitch, e da **Helena** de
aceder a dados em formatos editáveis.

O separador **Pilares** replica a estrutura da página de detalhe individual de cada país, mas organizada em duas colunas paralelas, uma por país.
A informação de cada pilar é apresentada de forma alinhada horizontalmente, permitindo comparar diretamente os valores de ambos os países para cada
métrica. 

Os *badges* de posicionamento no ranking surgem junto ao nome de cada país, e o botão **"Mostrar Pilares"** mantém-se disponível no topo para que o utilizador possa trocar de pilar a qualquer momento, tal como na vista individual.

### 3.5 Página "Execução"

A secção "Execução" é acessível através do menu de navegação principal e disponibiliza três subsecções: **Visão Geral**, **Metas e Marcos**, 
**Desembolsos** e **LinhaTemporal**.

#### 3.5.1 Visão Geral de Execução

A página de Visão Geral agrega os dados de execução de todos os Estados-Membros numa única vista panorâmica. 

No topo, quatro cartões de destaque apresentam as métricas globais mais relevantes: o número de marcos
concluídos, o total de fundos aprovados e desembolsados, a execução por pilares e áreas e o número de marcos atrasados. 

Esta visão macro responde diretamente às necessidades
da **Helena Vasconcelos**, que necessita de monitorizar o progresso real face aos marcos definidos, e do **Marco Rossi**, que pretende identificar
quais os países e pilares com maior volume de investimento.

Abaixo, a tabela **Execução por Estado-Membro** lista os países com as colunas País, Fundos Aprovados, Execução e Marcos Concluídos, esta última
representada por uma barra de progresso horizontal acompanhada do valor absoluto (ex: 37/82), tornando a comparação entre países imediata e
intuitiva. 

Todas as colunas são ordenáveis, permitindo ao utilizador reorganizar a tabela por ordem alfabética, por volume de fundos aprovados,
por percentagem de execução ou por marcos concluídos, respondendo à necessidade da **Clara Mendes** de comparar o desempenho entre países de
forma direta. 

O botão "Ver tudo" permite expandir a tabela para consultar todos os Estados-Membros.

#### 3.5.2 Metas e Marcos

A página de Metas e Marcos é introduzida por um cabeçalho com fundo escuro que contextualiza o seu propósito: apresentar o progresso na implementação
dos compromissos definidos nos Planos de Recuperação e Resiliência dos Estados-Membros.

À esquerda, um painel de filtros permite refinar os dados apresentados por **País**, **Tipo de Medida**, **Pilar** e **Ano**, sendo o ano atual
(2026) selecionado por omissão. Esta capacidade de filtragem granular é essencial para a **Helena**, que necessita de aceder a metas específicas
por setor, e permite à **Clara** isolar os dados relevantes para a sua
região ou área de interesse.

À direita, o painel **Estado dos Marcos e Metas** apresenta três categorias: Concluídos, Suspensos e Não Avaliados, através de barras
horizontais e um gráfico de anel que indica a percentage, de conclusão global. 

A introdução da categoria "Suspensos", ausente nas vistas de detalhe por país, acrescenta uma camada de detalhe relevante para utilizadores que monitorizam
bloqueios ou atrasos no processo de execução.

#### 3.5.3 Desembolsos

A página de Desembolsos apresenta, para cada país, um histórico detalhado dos pagamentos transferidos pela União Europeia e a lista das entidades que
receberam os maiores montantes. O cabeçalho identifica visualmente o país em contexto, com a respetiva bandeira e nome.

A tabela **100 Maiores Beneficiários** lista as entidades por montante recebido, projeto associado e pilar estratégico correspondente. Cada pilar
é identificado por uma *tag* colorida (ex: verde para Transição Ecológica, azul para Transformação Digital), permitindo uma leitura rápida da
distribuição sectorial dos fundos. Para não sobrecarregar visualmente a página, apenas um subconjunto de entradas é apresentado inicialmente; ao
clicar em "Ver Mais", a tabela expande para mostrar todos os beneficiários, com a possibilidade de filtrar por pilar estratégico. Esta decisão de design
respeita o princípio de apresentação progressiva da informação, evitando a sobrecarga cognitiva. 

A opção de exportação permite à **Helena** obter os dados em formato editável para análise externa, e ao **Marco** utilizar
a informação em apresentações de pitch.

Abaixo, a tabela **Cronologia de Recebimentos** apresenta o histórico cronológico dos pagamentos recebidos pelo país, com as colunas Data,
Montante, Tipo (Subvenção ou Empréstimo, distinguidos por *tags* de cor diferente) e Descrição. 

Esta linha temporal de pagamentos permite à **Helena** verificar o ritmo de desembolso e cruzar as datas com os marcos
cumpridos, e à **Clara** compreender se os fundos prometidos estão efetivamente a ser transferidos.

### 3.6 Página "Indicadores"

A página "Indicadores" é acessível diretamente através da barra de navegação principal e apresenta os 14 indicadores comuns de reporte obrigatório 
por todos os Estados-Membros da União Europeia.

O cabeçalho da página, com fundo azul escuro, contextualiza o propósito da secção. Esta contextualização é especialmente importante para o perfil 
da **Clara Mendes**, que beneficia de uma introdução clara antes de ser exposta aos dados quantitativos.

**Figura 9:** Captura de ecrã da página "Indicadores Comuns".

Imediatamente abaixo do cabeçalho, são apresentados os primeiros cartões de indicadores, cada um identificado pelo número e nome do indicador, acompanhado de ícones representativos e do valor agregado europeu (por exemplo, o Indicador 1: Poupança no consumo anual de energia primária, apresenta o valor total de 37 568 052 MWh/Ano). 

Um ícone de ligação externa em cada cartão permite ao utilizador aceder ao detalhe completo do indicador, respeitando o princípio de revelação progressiva.

No topo da página de detalhe de cada indicador, um botão "Mostrar Indicadores" abre um painel lateral com a lista dos 14 indicadores numerados, permitindo ao utilizador navegar diretamente entre indicadores sem regressar à página de listagem. 

À direita deste botão, uma barra de destaque apresenta o valor agregado do indicador atualmente selecionado (ex: "Total de poupança 37 568 052 (MWh/Ano)"), garantindo que o contexto quantitativo global está sempre visível.

**Figura 10:** Vista de detalhe do Indicador Comum 1 - Poupança no Consumo Anual de Energia Primária.

A página de detalhe de cada indicador organiza-se em três blocos principais:
- No topo, um cartão descritivo contextualiza o indicador com linguagem acessível. Esta descrição, como já foi mencionada, serve diretamente o perfil da **Clara**, que necessita de linguagem clara e de compreender o impacto concreto no quotidiano.

- De seguida, é apresentado o gráfico de evolução temporal do indicador, neste caso, um gráfico de barras verticais que mostra a progressão anual das poupanças em MWh/Ano. 
À direita do gráfico, uma caixa de "Atenção" apresenta notas metodológicas relevantes, como o facto de se tratar de um indicador de stock (valores acumulados que só podem aumentar) e de os dados da França não estarem representados por serem reportados em termos de energia final em vez de energia primária. 
Esta transparência metodológica é fundamental para a **Helena Vasconcelos**, que necessita de compreender as limitações dos dados antes de os utilizar em análises.

### 3.7 Página "Pilares"

A página "Pilares" é acessível tanto através da barra de navegação principal como através do badge de posicionamento no ranking presente na página de detalhe de cada país. Esta página agrega a informação de todos os Estados-Membros numa visão comparativa europeia para o pilar selecionado.

**Figura 11:** Captura de ecrã da grelha de seleção de pilares.

A entrada na página apresenta uma grelha de seis cards clicáveis, cada um representando um pilar temático do PRR. 

Esta estrutura serve todos os perfis de utilizador: a Helena acede diretamente ao pilar de interesse para a sua análise; o Marco navega para Transição Ecológica ou Transformação Digital em função dos seus objetivos de negócio; a Clara pode explorar o pilar de Políticas para a Próxima Geração para comparar investimentos em educação.

**Figura 12:** Vista de detalhe do pilar Transição Ecológica - métricas globais e descrição.

Após selecionar um pilar, a página organiza-se em duas zonas:
- No topo, um botão "Mostrar Pilares" permite ao utilizador trocar de pilar a qualquer momento sem perder o contexto da análise. Abaixo, um cartão descritivo contextualiza o pilar selecionado, no caso da Transição Ecológica.
-De seguida, três cartões de destaque apresentam as métricas agregadas a nível europeu para o pilar selecionado. 
Esta visão macro permite que o Marco Rossi contextualize rapidamente o estado geral do pilar à escala europeia antes de aprofundar a análise por país.


**Figura 13:** Tabela de Liderança dos Estados-Membros para o pilar selecionado.

A secção principal da página é a Tabela de Liderança, que apresenta os Estados-Membros ordenados pelo volume total de investimento alocado ao pilar, com as colunas País (com bandeira), Total de Investimento e Execução. Esta tabela permite comparações imediatas: Portugal lidera em volume de investimento ($67,7M) mas apresenta uma execução de apenas 24%, enquanto a Alemanha, com menor investimento ($32,1M), regista a execução mais elevada (74%). 

Esta distinção entre volume investido e ritmo de execução é particularmente relevante para a **Helena**, que monitoriza o progresso real face aos marcos definidos, e para o **Marco**, que necessita de identificar os países que estão não só a investir mais, mas também a executar com maior eficácia. Um botão "Ver tudo" permite expandir a tabela para consultar todos os Estados-Membros.

### 3.8 Histórico de Revisões de Planos

A página de Histórico de Revisões é acessível através da Página de Lista de Países, funcionando como uma vista especializada para análise de logs e transparência administrativa. 

Esta transição de contexto é sinalizada por um botão, mantendo a consistência visual com o restante dashboard. 

Ao entrar nesta página, o sistema preserva a hierarquia de navegação, permitindo ao utilizador regressar rapidamente à exploração por países através da barra de navegação.

O design promove o **Controlo e Liberdade do Utilizador** ao oferecer múltiplos caminhos de navegação: o utilizador pode consultar revisões específicas dentro do detalhe de um país ou optar pela visão global no Histórico, permitindo que cada perfil (seja o analista de dados ou o cidadão comum) escolha a escala de detalhe que melhor serve os seus objetivos.

#### 3.8.1 Visibilidade do Estado do Sistema

Na página de Histórico, a inclusão de contadores de resultados ('A mostrar 1-10 de 145') e o uso de etiquetas coloridas (badges) para estados como Pendente ou Aprovado garantem que o utilizador compreende instantaneamente a situação de cada processo.

#### 3.8.2 Opção de Filtrar

O design promove o **Controlo e Liberdade do Utilizador** ao oferecer múltiplos caminhos de navegação.

Para gerir a elevada densidade de dados, a página disponibiliza ferramentas de filtragem que permitem isolar revisões por País, Estado do Pedido (Aceite, Pendente ou Recusado) e Pilar Estratégico.

O uso de placeholders informativos nos campos de pesquisa orienta o utilizador sobre o tipo de dado esperado, reduzindo a carga cognitiva. 

Esta funcionalidade é essencial para o perfil do **Marco Rossi**, que pode querer filtrar apenas revisões ligadas à "Transição Verde", ou para a **Helena**, que necessita de auditar apenas processos com estado "Pendente" num determinado intervalo de datas.


### 3.9 Rodapé (*Footer*)

O rodapé da interface, embora a navegação principal esteja sempre acessível através da *navbar* fixa no topo, cumpre um conjunto de funções
complementares que justificam a sua presença.

**Figura 14:** Rodapé.

À esquerda, replica as ligações para as secções principais da aplicação (Início, Países, Execução, Indicadores e Pilares). Embora redundante face
à *navbar*, esta repetição é uma convenção estabelecida na web que os utilizadores reconhecem e esperam, especialmente após percorrerem uma
página longa, quando fazer *scroll* até ao topo para navegar representaria um esforço desnecessário.

À direita, dois elementos de utilidade global completam o rodapé: um botão **FAQ**, que oferece acesso a ajuda contextual sem interromper o fluxo de
navegação, particularmente útil para a **Clara Mendes**, que pode não estar familiarizada com conceitos financeiros ou técnicos do PRR, e um botão
**Exportar**, que disponibiliza a exportação de dados a partir de qualquer ponto da aplicação, sem obrigar o utilizador a navegar até uma página
específica para o fazer.

Por fim, a indicação **"Dados atualizados em: 08/03/2026"** transmite de forma transparente a frescura dos dados apresentados, respondendo à
necessidade da **Helena** de verificar a atualidade da informação antes de a utilizar em análises ou relatórios.


---

## 4. Avaliação Heurística

A interface foi avaliada com recurso às Heurísticas de Nielsen [\[2\]](#referências). Cada elemento do grupo avaliou os fluxos em que menos participou, e os problemas encontrados foram corrigidos ou registados como melhorias futuras.

### 4.1 Visibilidade do Estado do Sistema

O *dashboard* apresenta de imediato indicadores-chave (fundos alocados, execução, marcos concluídos). Na página de detalhe, barras de progresso comunicam o estado de execução instantaneamente. Na filtragem de dados, *chips* com os filtros ativos garantem visibilidade sobre os critérios aplicados. **Melhoria futura:** adicionar *spinners* de carregamento para conexões lentas.

### 4.2 Correspondência com o Mundo Real e Reconhecimento em vez de Recordação

A terminologia utilizada é familiar ao domínio ("Marcos", "Metas", "Pilares", "Desembolsos"), e bandeiras nacionais, ícones temáticos e mapas interativos tiram partido do conhecimento prévio dos utilizadores. Os tipos de gráfico escolhidos (barras, *donuts*, coropléticos) são amplamente conhecidos, garantindo acessibilidade mesmo para utilizadores como a **Clara**. Os pilares são apresentados como *tags* com ícone e nome, dispensando memorização; na lista de países, bandeiras e indicadores são visíveis sem interação, e na comparação os dados alinhados lado a lado eliminam a necessidade de memorizar valores.

### 4.3 Controlo, Liberdade e Flexibilidade de Utilização

A barra de navegação principal está sempre visível, permitindo regressar a qualquer secção, e no fluxo de comparação é possível alterar a seleção sem reiniciar o processo. A pesquisa por nome e os filtros rápidos servem utilizadores experientes como a **Helena**, enquanto a navegação sequencial e o *ranking* Top 3 servem utilizadores menos experientes. A exportação de dados filtrados poupa tempo a quem sabe o que procura. **Melhorias futuras:** botão "Voltar ao topo" em páginas com *scroll* extenso e atalhos de teclado para ações frequentes.

### 4.4 Consistência e Normas

A barra de navegação, cartões de resumo, botões de ação e separadores mantêm-se idênticos em todos os ecrãs. A iconografia segue as *Material Icons* [\[3\]](#referências), e os efeitos de *hover* são uniformes em todos os elementos clicáveis. Optou-se por um *dropdown* (em vez de diálogo) para exportação, priorizando rapidez sobre consistência total com o fluxo de comparação.

### 4.5 Prevenção e Recuperação de Erros, Ajuda e Documentação

Na comparação de países, o botão "Comparar" fica desativado até dois países serem selecionados, e conjuntos vazios de resultados apresentam uma mensagem informativa com sugestões de ação em vez de uma tabela vazia. Ícones "i" junto a métricas menos intuitivas fornecem *tooltips* explicativas, e *tooltips* contextuais proporcionam micro-ajuda *inline* sem abandonar o contexto da análise.

### 4.6 Estética e Desenho Minimalista

Paleta contida (azul-escuro, branco, acentos subtis), tipografia limpa e espaçamento generoso. Separadores e secções colapsáveis dividem grandes volumes de dados em vistas coerentes. *Tooltips* complementam elementos visuais sem poluir a interface permanentemente.

---

## 5. Conclusão e Trabalho Futuro

Ao longo das últimas semanas, foi prototipada uma interface para uma plataforma de visualização de dados sobre a execução dos Planos Nacionais de Recuperação e Resiliência. Os três perfis de utilizador fornecidos, a Helena, o Marco e a Clara, foram utilizados para modelar a interface com base nas características e necessidades destes utilizadores hipotéticos, garantindo que a solução responde a diferentes níveis de literacia de dados e diferentes objetivos de utilização.

O protótipo desenvolvido em Figma [\[1\]](#referências) cobre os fluxos principais da aplicação: consulta do *dashboard* global, navegação por país, exploração de indicadores, comparação entre Estados-Membros e exportação de dados. Por fim, foi feita uma análise heurística da interface prototipada com base nas heurísticas de Nielsen [\[2\]](#referências), tendo sido identificados e corrigidos alguns problemas. Foram também identificados aspetos menos críticos, como a adição de indicadores de carregamento, atalhos de teclado e páginas de erro, que não implicam grandes alterações à arquitetura atual da interface e podem ser abordados na próxima iteração.

Para a segunda fase deste trabalho prático, a interface será implementada com integração de dados reais via a API do *EU Recovery and Resilience Scoreboard*, passando de protótipo estático a aplicação funcional. Nessa fase, será também possível realizar testes com utilizadores reais, complementando a avaliação heurística com dados empíricos sobre a usabilidade da interface.

---

## Referências

1. Figma, "Figma: Collaborative Interface Design Tool." [Online]. Available: <https://www.figma.com/>
2. Nielsen Norman Group, "10 Usability Heuristics for User Interface Design." [Online]. Available: <https://www.nngroup.com/articles/ten-usability-heuristics/>
3. Google Fonts, "Material Symbols & Icons." [Online]. Available: <https://fonts.google.com/icons>
4. European Commission, "Recovery and Resilience Scoreboard." [Online]. Available: <https://ec.europa.eu/economy_finance/recovery-and-resilience-scoreboard/>
