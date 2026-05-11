<script setup>
import IntroCard from '@/components/IntroCard.vue';
import AllFlags from '@/components/AllFlags.vue';
import FaqItem from '@/components/FaqQuestion.vue'

const title = "Perguntas Frequentes";
const description = `Encontre aqui esclarecimentos sobre a aplicação dos fundos europeus, o cumprimento de metas e o impacto direto do PRR no desenvolvimento do país.`;

const faqs = [
  {
    question: "O que é o PRR e o Mecanismo de Recuperação e Resiliência?",
    response: "O Plano de Recuperação e Resiliência (PRR) é um programa de aplicação nacional, com um período de execução até 2026, que visa implementar reformas e investimentos para repor o crescimento económico sustentado. É financiado pelo Mecanismo de Recuperação e Resiliência, o elemento central do NextGenerationEU."
  },
  {
    question: "O que são 'Marcos e Metas'?",
    response: "São os objetivos que cada país deve cumprir. Os Marcos referem-se a etapas qualitativas (como a entrada em vigor de uma lei) e as Metas a objetivos quantitativos (como o número de quilómetros de ferrovia construídos ou pessoas formadas)."
  },
  {
    question: "O que são os 'Indicadores Comuns'?",
    response: "São métricas padrão definidas pela Comissão Europeia para monitorizar o desempenho dos planos de todos os Estados-Membros. Permitem avaliar o progresso em áreas como o apoio a empresas, competências digitais e poupança de energia de forma comparável."
  },
  {
    question: "Posso comparar o meu país com outros países?",
    response: "Sim. Através dos Indicadores Comuns e do Painel de Avaliação oficial (Scoreboard) da UE, é possível acompanhar o desempenho relativo de Portugal face aos restantes Estados-Membros na execução das metas e na aplicação dos fundos."
  }
]

</script>

<template>
  <div>
    <IntroCard 
      :title="title" 
      :description="description" 
      height="335px" 
      width="100%" 
    >
      <AllFlags />
    </IntroCard>
    <div class="faq-items">
      <FaqItem 
      v-for="(item, index) in faqs" 
      :key="index"
      :question="item.question"
      :response="item.response"
    />
    </div>
  </div>
</template>

<style scoped>
.faq-items {
  padding: 70px 80px;
}
</style>