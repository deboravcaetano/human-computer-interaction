<script setup lang="ts">
import { ref } from 'vue'
import arrowIcon from '@/assets/arrow-down-black.svg' 

defineProps<{
  question: string
  response: string
}>()

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

</script>

<template>
  <div class="faq-item">
    <button class="faq-item-header" @click="toggle" type="button">
      <span class="faq-question">{{ question }}</span>
      
      <img :src="arrowIcon" class="faq-arrow" :class="{ 'is-open': isOpen }" alt="" />
    </button>

    <div v-if="isOpen" class="faq-item-content">
      <p class="faq-response">{{ response }}</p>
    </div>
  </div>
</template>

<style scoped>
.faq-item {
  background-color: var(--bg-yellow);
  border-radius: 4px;
  margin-bottom: 12px;
  width: 100%;
}

.faq-item-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #000;
}

.faq-item-content {
  padding: 0 24px 20px 24px;
  color: #000;
}

.faq-question {
  font-family: var(--font-primary); 
  font-size: 0.90rem;
  font-weight: 700;
  line-height: 1.4;
}

.faq-response {
  font-family: var(--font-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.6;
  margin: 0;
}

.faq-arrow {
  width: 30px;
}

.is-open {
  transform: rotate(180deg);
}


p {
  margin: 0;
}
</style>