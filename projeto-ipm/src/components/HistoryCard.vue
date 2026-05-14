<script setup lang="ts">
import StatusPopUp from './StatusPopUp.vue'

defineProps<{
  country: string
  date: string
  description: string
  entity: string
  status: string          
  tempCategoryStatus: string //como ainda n existe o componente category vamos usar o status para simular
}>()
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="header-left">
        <div class="title-row">
          <h2 class="country-name">{{ country }}</h2>
          <StatusPopUp :status="status" />
        </div>
        <p class="date-text">{{ date }}</p>
      </div>

      <div class="category-placeholder">
        <StatusPopUp :status="tempCategoryStatus" />
      </div>
    </div>

    <div class="separator" />

    <div class="card-content">
      <div class="info-box">
        <label class="label">DESCRIÇÃO</label>
        <p class="text-description">{{ description }}</p>
      </div>
      <div class="info-box">
        <label class="label">ENTIDADE REQUERENTE</label>
        <p class="text-entity">{{ entity }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #ffffff;
  border: 1px solid #cbcbcb;
  border-radius: 8px;
  padding: 25px;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.country-name {
  font-family: var(--font-primary);
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  color: #000;
}

.date-text {
  font-family: var(--font-primary);
  font-size: 0.8rem;
  color: #a0a0a0;
  margin: 4px 0 0 0;
}

.category-placeholder {
  transform: scale(1.1);
}

.separator {
  height: 1px;
  background: #e7e7e7;
  margin: 16px 0;
}

.card-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.info-box {
  background: #f9f9f9;
  padding: 16px;
  border: 1px solid #ececec;
  border-radius: 4px;
}

.label {
  font-family: var(--font-primary);
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  color: #434343; 
  margin-bottom: 8px;
  text-transform: uppercase;
}

.text-description {
  font-family: var(--font-secondary);
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.5;
  color: #414141;
  margin: 0;
}

.text-entity {
  font-family: var(--font-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  color: #5f5f5f;
  margin: 0;
}
</style>