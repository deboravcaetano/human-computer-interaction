<script setup lang="ts">
import { useRouter } from 'vue-router'
import IntroCard from '@/components/IntroCard.vue'
import arrowDownBlack from '@/assets/arrow-down-black.svg' 

const router = useRouter()

const title = 'Execução do Plano de Recuperação e Resiliência'
const description = 'Selecione uma das áreas abaixo para explorar os dados detalhados, o progresso financeiro e o cumprimento de metas.'

const subSeccoes = [
  {
    title: 'Visão Geral',
    description: 'Análises macro, gráficos de distribuição e o panorama geral do cumprimento do plano.',
    path: '/execucao/visao-geral',
  },
  {
    title: 'Metas e Marcos',
    description: 'Acompanhe detalhadamente o cumprimento dos objetivos, reformas e investimentos institucionais.',
    path: '/execucao/metas-marcos',
  },
  {
    title: 'Desembolsos',
    description: 'Fluxos financeiros, subvenções (fundos perdidos) e empréstimos concedidos aos estados-membros.',
    path: '/execucao/desembolsos',
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="execucao-page">
    <IntroCard 
      :title="title" 
      :description="description" 
      height="281px" 
      width="100%" 
    />

    <main class="hub-container">
      <div class="hub-grid">
        <button
          v-for="item in subSeccoes"
          :key="item.path"
          type="button"
          class="hub-card"
          :aria-label="`Navegar para ${item.title}`"
          @click="navigateTo(item.path)"
        >
          <div class="hub-card__icon-wrapper">
            <span class="hub-card__icon-placeholder">{{ item.title[0] }}</span>
          </div>

          <div class="hub-card__content">
            <h2 class="hub-card__title">{{ item.title }}</h2>
            <p class="hub-card__description">{{ item.description }}</p>
          </div>
          
          <img 
            class="hub-card__arrow" 
            :src="arrowDownBlack" 
            alt="" 
            aria-hidden="true" 
          />
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.execucao-page {
  width: 100%;
  padding-bottom: 80px;
  font-family: var(--font-primary);
  background: var(--bg-gray-light);
  min-height: 100vh;
}

.hub-container {
  width: min(100% - 40px, 1200px);
  margin: 46px auto 0;
}

.hub-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.hub-card {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 32px;
  background: var(--bg-white);
  border: 1px solid var(--text-gray-light);
  border-radius: 16px;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(16, 29, 66, 0.06);
  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
}

.hub-card:hover {
  transform: translateY(-2px);
  border-color: var(--bg-blue);
  box-shadow: 0 8px 20px rgba(16, 29, 66, 0.12);
}

.hub-card:focus-visible {
  outline: 2px solid var(--bg-blue);
  outline-offset: 2px;
}

.hub-card__icon-wrapper {
  width: 56px;
  height: 56px;
  background-color: #122655;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hub-card__icon-placeholder {
  color: var(--text-white);
  font-size: 1.5rem;
  font-weight: 700;
}

.hub-card__content {
  flex: 1;
}

.hub-card__title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-blue-dark);
  margin-bottom: 6px;
}

.hub-card__description {
  font-size: 0.95rem;
  color: var(--text-gray);
  line-height: 1.4;
  font-weight: 500;
}

.hub-card__arrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  transform: rotate(-90deg); 
  transition: transform 160ms ease;
}


@media (max-width: 640px) {
  .hub-container {
    width: calc(100% - 32px);
    margin-top: 32px;
  }

  .hub-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
  }

  .hub-card__arrow {
    display: none;
  }
}
</style>