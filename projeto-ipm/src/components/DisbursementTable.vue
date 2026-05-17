<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/components/Button.vue'

type ExportFormat = 'PDF' | 'JSON' | 'CSV'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  rows: {
    type: Array,
    default: () => []
  },
  headerVariant: {
    type: String,
    default: 'success'
  },
  emptyLabel: {
    type: String,
    default: 'Sem dados.'
  },
  exportable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits<{
  (event: 'export', format: ExportFormat): void
}>()

const headerClass = computed(() => {
  return props.headerVariant === 'primary'
    ? 'disbursement-table__header--primary'
    : 'disbursement-table__header--success'
})
</script>

<template>
  <article class="disbursement-section">
    <div class="disbursement-section__heading">
      <h2>{{ title }}</h2>
      <Button
        v-if="exportable"
        :exportable="true"
        :compact="true"
        color="primary"
        @export="(format) => emit('export', format)"
      />
    </div>
    <div class="disbursement-table">
      <div class="disbursement-table__header" :class="headerClass">
        <span>Data</span>
        <span>Montante</span>
        <span>Tipo</span>
        <span>Descricao</span>
      </div>
      <p v-if="!rows.length" class="disbursement-table__empty">{{ emptyLabel }}</p>
      <div
        v-else
        v-for="item in rows"
        :key="`${item.date}-${item.description}`"
        class="disbursement-table__row"
      >
        <span>{{ item.date }}</span>
        <span>{{ item.amountLabel }}</span>
        <span
          class="disbursement-tag"
          :class="item.type === 'Subvencao' ? 'disbursement-tag--success' : 'disbursement-tag--info'"
        >
          {{ item.type }}
        </span>
        <span>{{ item.description }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.disbursement-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.disbursement-section__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.disbursement-section h2 {
  margin: 0;
  font-size: 14px;
  color: #111827;
}

.disbursement-table {
  background: #f2f3f5;
  border-radius: 10px;
  border: 1px solid #cfd3db;
  overflow: hidden;
}

.disbursement-table__header {
  display: grid;
  grid-template-columns: 140px 160px 150px minmax(0, 1fr);
  padding: 12px 18px;
  font-size: 12px;
  color: #ffffff;
  font-weight: 600;
}

.disbursement-table__header--success {
  background: #49b36a;
}

.disbursement-table__header--primary {
  background: #1e40af;
}

.disbursement-table__row {
  display: grid;
  grid-template-columns: 140px 160px 150px minmax(0, 1fr);
  padding: 12px 18px;
  font-size: 13px;
  color: #1f2937;
  align-items: center;
  border-top: 1px solid #d6d6d6;
}

.disbursement-table__empty {
  margin: 0;
  padding: 14px 18px;
  font-size: 13px;
  color: var(--text-gray);
}

.disbursement-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
}

.disbursement-tag--success {
  background: #ffe39a;
  color: #7c5000;
}

.disbursement-tag--info {
  background: #cfe1ff;
  color: #2b4ea1;
}

@media (max-width: 900px) {
  .disbursement-table__header,
  .disbursement-table__row {
    grid-template-columns: 120px 140px 130px minmax(0, 1fr);
  }
}

@media (max-width: 700px) {
  .disbursement-table__header,
  .disbursement-table__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
</style>
