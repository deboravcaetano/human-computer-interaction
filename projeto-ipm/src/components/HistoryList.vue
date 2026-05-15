<script setup>
import { computed, ref, watch } from 'vue'
import HistoryCard from './HistoryCard.vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  itemsPerPage: {
    type: Number,
    default: 4
  }
})

const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.items.length / props.itemsPerPage)))

const visibleItems = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage

  return props.items.slice(start, start + props.itemsPerPage)
})

const resultStart = computed(() => {
  if (!props.items.length) return 0

  return (currentPage.value - 1) * props.itemsPerPage + 1
})

const resultEnd = computed(() => Math.min(currentPage.value * props.itemsPerPage, props.items.length))

const pages = computed(() => Array.from({ length: totalPages.value }, (_, index) => index + 1))

watch(
  () => props.items.length,
  () => {
    if (!props.items.length) {
      currentPage.value = 1
      return
    }

    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value
      return
    }

    currentPage.value = 1
  }
)

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page
}
</script>

<template>
  <section class="history-section" aria-label="Historico de revisoes">
    <p class="results-text">
      Resultados: {{ resultStart }}-{{ resultEnd }} de {{ items.length }}.
    </p>

    <p v-if="!items.length" class="empty-text">Nenhuma revisão encontrada.</p>

    <div v-else class="history-list">
      <article v-for="item in visibleItems" :key="item.id" class="history-item">
        <div class="flag-column">
          <span class="timeline-line" aria-hidden="true"></span>
          <img class="country-flag" :src="item.flag" :alt="`Bandeira de ${item.country}`" />
        </div>

        <HistoryCard
          class="history-card"
          :country="item.country"
          :date="item.date"
          :description="item.description"
          :entity="item.entity"
          :status="item.status"
          :category="item.category"
        />
      </article>
    </div>

    <nav v-if="totalPages > 1" class="pagination" aria-label="Paginacao do historico">
      <button
        class="page-button page-button--arrow"
        type="button"
        aria-label="Pagina anterior"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        ‹
      </button>

      <button
        v-for="page in pages"
        :key="page"
        class="page-button"
        :class="{ 'page-button--active': page === currentPage }"
        type="button"
        :aria-current="page === currentPage ? 'page' : undefined"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button
        class="page-button page-button--arrow"
        type="button"
        aria-label="Pagina seguinte"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        ›
      </button>
    </nav>
  </section>
</template>

<style scoped>
.history-section {
  max-width: 1200px;
  width: 100%;
  padding: 0 20px 56px;
  margin: 28px auto 0;
}

.results-text {
  margin: 0 0 12px 8px;
  color: #1b1b1b;
  font-family: var(--font-primary);
  font-size: 0.78rem;
  font-weight: 500;
}

.history-list {
  padding: 22px 30px 26px;
  border: 1px solid #dfe7f5;
  border-radius: 8px;
  background: #fbfcff;
}

.history-item {
  display: grid;
  grid-template-columns: 82px minmax(0, 1fr);
  align-items: stretch;
}

.history-item:last-child .history-card {
  margin-bottom: 0;
}

.flag-column {
  position: relative;
  display: flex;
  justify-content: center;
  padding-top: 20px;
}

.timeline-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
  background: #fdca40;
}

.country-flag {
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(8, 24, 66, 0.16);
}

.history-card {
  min-width: 0;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
}

.page-button {
  width: 34px;
  height: 34px;
  border: 1px solid #d7dce7;
  border-radius: 999px;
  background: #ffffff;
  color: #0a1a44;
  font-family: var(--font-primary);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.page-button:hover:not(:disabled),
.page-button--active {
  border-color: #0a1a44;
  background: #f4f7ff;
}

.page-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.page-button--arrow {
  font-size: 1.5rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .history-section {
    padding: 0 16px 44px;
    margin-top: 22px;
  }

  .history-list {
    padding: 0;
    border: 0;
    background: transparent;
  }

  .history-item {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .flag-column {
    flex: 0 0 auto;
    padding-top: 18px;
  }

  .timeline-line {
    display: none;
  }

  .country-flag {
    width: 38px;
    height: 38px;
  }

  .history-card {
    flex: 1;
  }

  .pagination {
    justify-content: center;
    gap: 8px;
  }
}

@media (max-width: 480px) {
  .history-item {
    gap: 10px;
  }

  .country-flag {
    width: 34px;
    height: 34px;
  }

  .page-button {
    width: 32px;
    height: 32px;
  }
}
</style>
