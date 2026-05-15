<script setup>
import { onMounted, ref } from 'vue';
import IntroCard from '@/components/IntroCard.vue';
import AllFlags from '@/components/AllFlags.vue';
import FaqItem from '@/components/FaqQuestion.vue'
import { getFaqs } from '@/services/api';

const title = "Perguntas Frequentes";
const description = `Encontre aqui esclarecimentos sobre a aplicação dos fundos europeus, o cumprimento de metas e o impacto direto do PRR no desenvolvimento do país.`;

const faqs = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

onMounted(async () => {
  try {
    faqs.value = await getFaqs();
  } catch (error) {
    errorMessage.value = 'Não foi possível carregar as perguntas frequentes.';
  } finally {
    isLoading.value = false;
  }
});
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
      <p v-if="isLoading" class="state-text">A carregar perguntas...</p>
      <p v-else-if="errorMessage" class="state-text state-text--error">{{ errorMessage }}</p>
      <template v-else>
        <FaqItem 
          v-for="item in faqs" 
          :key="item.id"
          :question="item.question"
          :response="item.response"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.faq-items {
  padding: 70px 80px;
}

.state-text {
  margin: 0;
  font-family: var(--font-primary);
  color: var(--text-gray);
}

.state-text--error {
  color: #b42318;
}
</style>