<script setup>
import IntroCard from '@/components/IntroCard.vue';

const title = "Indicadores Comuns";
const description = `O Painel de Avaliação da Recuperação e Resiliência monitoriza o progresso do PRR através de 14 indicadores comuns.


Estes indicadores refletem o progresso na implementação dos planos nacionais e desempenho global do mecanismo face aos objetivos partilhados.


Os Estados-Membros são responsáveis pela recolha e reporte destes dados à Comissão Europeia semestralmente, até ao final de Fevereiro e Agosto.`;
</script>

<template>
  <div>
    <IntroCard 
      :title="title" 
      :description="description" 
      height="362px" 
      width="100%" 
    >
    </IntroCard>
  </div>
</template>