<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

type BreadcrumbItem = {
  label: string
  to?: string
}

const route = useRoute()

const breadcrumbs = computed(() => {
  const routeBreadcrumbs = route.meta.breadcrumb as BreadcrumbItem[] | undefined
  return routeBreadcrumbs ?? []
})
</script>

<template>
  <nav v-if="breadcrumbs.length" class="breadcrumb" aria-label="Breadcrumb">
    <ol class="breadcrumb__list">
      <li
        v-for="(item, index) in breadcrumbs"
        :key="`${item.label}-${index}`"
        class="breadcrumb__item"
      >
        <router-link
          v-if="item.to && index < breadcrumbs.length - 1"
          :to="item.to"
          class="breadcrumb__link"
        >
          {{ item.label }}
        </router-link>
        <span v-else class="breadcrumb__current" aria-current="page">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.breadcrumb {
  width: 100%;
  margin: 0;
  padding: 18px 25px 0;
  font-family: var(--font-primary);
  background-color: var(--bg-blue);
}

.breadcrumb__list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  list-style: none;
  padding: 0;
  margin: 0;
  color: var(--text-white);
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.breadcrumb__item {
  display: flex;
  align-items: center;
  min-width: 0;
}

.breadcrumb__item:not(:last-child)::after {
  content: ">";
  margin-left: 8px;
  color: rgba(255, 255, 255, 0.72);
}

.breadcrumb__link {
  color: var(--text-white);
  text-decoration: none;
  transition: color 160ms ease;
}

.breadcrumb__link:hover {
  color: var(--text-yellow);
  text-decoration: underline;
}

.breadcrumb__current {
  color: rgba(255, 255, 255, 0.82);
}

@media (max-width: 768px) {
  .breadcrumb {
    padding: 14px 16px 0;
  }

  .breadcrumb__list {
    font-size: 13px;
    gap: 6px;
  }

  .breadcrumb__item:not(:last-child)::after {
    margin-left: 6px;
  }
}
</style>