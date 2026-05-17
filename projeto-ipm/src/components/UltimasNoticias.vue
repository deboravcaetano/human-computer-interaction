<script setup>
import { computed, ref } from 'vue';
import arrowDownBlackIcon from '@/assets/arrow-down-black.svg';

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  initialCount: {
    type: Number,
    default: 3
  }
});

const flagAssets = import.meta.glob('@/assets/flags/*.svg', {
  eager: true,
  import: 'default'
});

const expanded = ref(false);

const visibleItems = computed(() => {
  return expanded.value ? props.items : props.items.slice(0, props.initialCount);
});

function getFlagSrc(flagAsset) {
  return flagAssets[`/src/assets/flags/${flagAsset}.svg`] ?? '';
}

function toggleExpanded() {
  expanded.value = !expanded.value;
}
</script>

<template>
  <article class="news-card">
    <h2 class="news-title">Últimas notícias:</h2>

    <div class="news-timeline">
      <span class="news-line" aria-hidden="true"></span>

      <div
        v-for="(item, index) in visibleItems"
        :key="item.id ?? index"
        class="news-row"
        :style="{ '--row-delay': `${index * 60}ms` }"
      >
        <time class="news-date" :datetime="item.date">{{ item.date }}</time>

        <span class="news-dot" aria-hidden="true">
          <span class="news-dot-inner"></span>
        </span>

        <img
          v-if="item.flagAsset"
          class="news-flag"
          :src="getFlagSrc(item.flagAsset)"
          :alt="item.country ? `Bandeira de ${item.country}` : ''"
        >

        <p class="news-text">
          {{ item.text }}
          <span v-if="item.source" class="news-source">/ {{ item.source }}</span>
        </p>
      </div>
    </div>

    <button
      v-if="items.length > initialCount"
      class="news-toggle"
      type="button"
      @click="toggleExpanded"
    >
      {{ expanded ? 'Ver menos' : 'Ver mais' }}
      <img
        class="news-toggle-icon"
        :class="{ 'news-toggle-icon--open': expanded }"
        :src="arrowDownBlackIcon"
        alt=""
        aria-hidden="true"
      >
    </button>
  </article>
</template>

<style scoped>
.news-card {
  width: min(100%, 934px);
  min-height: 408px;
  margin: 0 auto;
  padding: 18px 20px 12px;
  background: #fffdf8;
  border: 1px solid var(--light-blue);
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(18, 38, 85, 0.18);
  box-sizing: border-box;
  font-family: var(--font-primary);
}

.news-title {
  margin: 0 0 28px;
  color: var(--text-blue-dark);
  font-family: var(--font-primary);
  font-size: clamp(1.35rem, 2vw, 1.55rem);
  font-weight: 800;
  line-height: 1.2;
}

.news-timeline {
  --date-column: 76px;
  --dot-size: 20px;
  --row-gap: 10px;
  position: relative;
  padding-bottom: 92px;
}

.news-line {
  position: absolute;
  top: -8px;
  bottom: 0;
  left: calc(var(--date-column) + var(--row-gap) + (var(--dot-size) / 2) - 1px);
  width: 2px;
  background: var(--dark-yellow);
  border-radius: 2px;
}

.news-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: var(--date-column) var(--dot-size) 28px minmax(0, 1fr);
  align-items: start;
  gap: var(--row-gap);
  margin-bottom: 44px;
  opacity: 0;
  transform: translateY(4px);
  animation: showNews 0.22s ease-out forwards var(--row-delay, 0ms);
}

.news-row:last-child {
  margin-bottom: 0;
}

.news-date {
  padding-top: 4px;
  color: #111111;
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.2;
}

.news-dot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 2px solid #0b1f4b;
  border-radius: 50%;
  background: #ffffff;
  box-sizing: border-box;
}

.news-dot-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dark-yellow);
}

.news-flag {
  width: 28px;
  height: 18px;
  margin-top: 2px;
  object-fit: cover;
  box-shadow: 0 1px 2px rgba(18, 38, 85, 0.18);
}

.news-text {
  margin: 0;
  padding-top: 2px;
  color: #111111;
  font-size: 0.82rem;
  font-weight: 500;
  line-height: 1.45;
}

.news-source {
  white-space: nowrap;
}

.news-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: #2f2f2f;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1;
}

.news-toggle:hover {
  color: #111111;
}

.news-toggle-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  transition: transform 0.25s ease;
}

.news-toggle-icon--open {
  transform: rotate(180deg);
}

@media (max-width: 900px) {
  .news-timeline {
    --date-column: 70px;
    --row-gap: 8px;
  }

  .news-card {
    min-height: 360px;
    padding: 18px 16px 12px;
  }

  .news-row {
    grid-template-columns: var(--date-column) var(--dot-size) 26px minmax(0, 1fr);
    margin-bottom: 30px;
  }

  .news-source {
    white-space: normal;
  }
}

@media (max-width: 560px) {
  .news-card {
    min-height: 0;
  }

  .news-timeline {
    --date-column: 66px;
    --row-gap: 8px;
    padding-bottom: 42px;
  }

  .news-row {
    grid-template-columns: var(--date-column) var(--dot-size) minmax(0, 1fr);
    grid-template-areas:
      "date dot text"
      ". . text";
  }

  .news-date {
    grid-area: date;
    font-size: 0.76rem;
  }

  .news-dot {
    grid-area: dot;
  }

  .news-flag {
    grid-area: text;
    margin-bottom: 6px;
  }

  .news-text {
    grid-area: text;
    padding-top: 28px;
    font-size: 0.78rem;
  }

}

@keyframes showNews {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
