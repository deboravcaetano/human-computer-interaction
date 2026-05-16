<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

type BreadcrumbItem = {
  label: string
  to?: string | (() => string) 
}

const route = useRoute()

const getTo = (item: BreadcrumbItem) => {
  return typeof item.to === 'function' ? item.to() : item.to
}

const breadcrumbs = computed(() => {
  const routeBreadcrumbs = route.meta.breadcrumb as BreadcrumbItem[] | undefined
  return (routeBreadcrumbs ?? []).map((item) => {
    if (route.path.includes('/mais') && item.label === 'Detalhe') {
      return {
        ...item,
        to: `/paises/${route.params.countryId}`,
      }
    }
    return item
  })
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
          :to="getTo(item)"
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
  padding: 16px 25px;
  font-family: var(--font-primary);
  background-color: var(--bg-blue);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
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
    padding: 12px 16px;
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